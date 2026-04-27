import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingListAutoState } from './entities/shopping-list-auto-state.entity';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { UpdateShoppingAutoItemDto } from './dto/update-shopping-auto-item.dto';
import { UsersService } from '../users/users.service';
import { MealPlansService } from '../meal-plans/meal-plans.service';

/**
 * Service de gestion de la liste de courses.
 *
 * Ce service gère trois parties importantes :
 * - les ingrédients automatiques calculés depuis le planning repas ;
 * - les items manuels ajoutés directement par l'utilisateur ;
 * - l'état utilisateur des ingrédients automatiques, comme `checked` et `hidden`.
 *
 * Règles métier :
 * - les ingrédients automatiques ne sont pas copiés en items manuels ;
 * - les ingrédients automatiques restent issus du planning ;
 * - seuls leurs états utilisateur sont persistés en base ;
 * - les items manuels restent stockés dans la table `shopping_items`.
 */
@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingItem)
    private readonly shoppingItemsRepository: Repository<ShoppingItem>,

    @InjectRepository(ShoppingListAutoState)
    private readonly autoStatesRepository: Repository<ShoppingListAutoState>,

    private readonly usersService: UsersService,
    private readonly mealPlansService: MealPlansService,
  ) {}

  /**
   * Récupère la liste de courses d'une semaine pour un utilisateur.
   *
   * La méthode fusionne :
   * - les ingrédients automatiques issus des recettes du planning ;
   * - les états persistés des ingrédients automatiques ;
   * - les items manuels ajoutés par l'utilisateur.
   *
   * Si un ingrédient automatique possède `hidden = true`, il n'est pas renvoyé.
   * Si un ingrédient automatique possède `checked = true`, il est renvoyé coché.
   *
   * @param date Date de référence au format `YYYY-MM-DD`.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns La liste de courses hebdomadaire avec les items automatiques et manuels.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   */
  async findWeek(date: string, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { startOfWeek, endOfWeek } = this.getWeekRange(date);

    const weekMealPlans = await this.mealPlansService.findWeek(date, userId);

    const autoStates = await this.autoStatesRepository.find({
      where: {
        user: { id: userId },
        weekStart: startOfWeek,
      },
      relations: ['user'],
    });

    const automaticItems = this.extractAutomaticItems(
      weekMealPlans.items,
      startOfWeek,
      autoStates,
    );

    const manualItems = await this.shoppingItemsRepository.find({
      where: {
        user: { id: userId },
        weekStart: startOfWeek,
      },
      relations: ['user'],
      order: {
        id: 'ASC',
      },
    });

    return {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      items: [
        ...automaticItems,
        ...manualItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          checked: item.checked,
          isManual: item.isManual,
          source: 'manual',
        })),
      ],
    };
  }

  /**
   * Ajoute un ingrédient manuel dans la liste de courses.
   *
   * L'item est rattaché à l'utilisateur connecté et à la semaine calculée
   * à partir de la date fournie dans le DTO.
   *
   * @param createShoppingItemDto Données de l'ingrédient manuel.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'item manuel créé et sauvegardé en base.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   */
  async createManualItem(
    createShoppingItemDto: CreateShoppingItemDto,
    userId: number,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { startOfWeek } = this.getWeekRange(createShoppingItemDto.date);

    const item = this.shoppingItemsRepository.create({
      name: createShoppingItemDto.name,
      quantity: createShoppingItemDto.quantity ?? '',
      unit: createShoppingItemDto.unit ?? '',
      checked: false,
      isManual: true,
      weekStart: startOfWeek,
      user,
    });

    return this.shoppingItemsRepository.save(item);
  }

  /**
   * Coche ou décoche un ingrédient manuel.
   *
   * Seuls les items manuels appartenant à l'utilisateur connecté
   * peuvent être modifiés par cette méthode.
   *
   * @param id Identifiant de l'item manuel.
   * @param updateShoppingItemDto Données de mise à jour contenant l'état `checked`.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'item manuel mis à jour.
   *
   * @throws {NotFoundException} Si l'item est introuvable ou appartient à un autre utilisateur.
   */
  async updateItem(
    id: number,
    updateShoppingItemDto: UpdateShoppingItemDto,
    userId: number,
  ) {
    const item = await this.shoppingItemsRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Ingrédient introuvable');
    }

    item.checked = updateShoppingItemDto.checked;

    return this.shoppingItemsRepository.save(item);
  }

  /**
   * Supprime un ingrédient manuel de la liste de courses.
   *
   * Cette suppression ne concerne que les items manuels persistés en base.
   * Les ingrédients automatiques doivent être masqués via `hideAutoItem`.
   *
   * @param id Identifiant de l'item manuel.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Un message de confirmation.
   *
   * @throws {NotFoundException} Si l'item est introuvable ou appartient à un autre utilisateur.
   */
  async removeItem(id: number, userId: number) {
    const item = await this.shoppingItemsRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Ingrédient introuvable');
    }

    await this.shoppingItemsRepository.remove(item);

    return {
      message: 'Ingrédient supprimé avec succès',
    };
  }

  /**
   * Coche ou décoche un ingrédient automatique issu du planning.
   *
   * Cette méthode ne modifie pas la recette, le planning ou l'ingrédient source.
   * Elle sauvegarde uniquement l'état utilisateur de l'ingrédient automatique.
   *
   * @param updateShoppingAutoItemDto Données de l'ingrédient automatique.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'état persistant de l'ingrédient automatique.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   */
  async updateAutoItem(
    updateShoppingAutoItemDto: UpdateShoppingAutoItemDto,
    userId: number,
  ) {
    const state = await this.findOrCreateAutoState(
      updateShoppingAutoItemDto,
      userId,
    );

    state.checked = updateShoppingAutoItemDto.checked ?? false;
    state.hidden = false;

    return this.autoStatesRepository.save(state);
  }

  /**
   * Masque un ingrédient automatique dans la liste de courses.
   *
   * Cette méthode ne supprime pas la recette ni le planning.
   * Elle ajoute simplement un état `hidden = true` pour l'utilisateur
   * et la semaine concernée.
   *
   * @param updateShoppingAutoItemDto Données de l'ingrédient automatique.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'état persistant de l'ingrédient automatique.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   */
  async hideAutoItem(
    updateShoppingAutoItemDto: UpdateShoppingAutoItemDto,
    userId: number,
  ) {
    const state = await this.findOrCreateAutoState(
      updateShoppingAutoItemDto,
      userId,
    );

    state.hidden = updateShoppingAutoItemDto.hidden ?? true;

    return this.autoStatesRepository.save(state);
  }

  /**
   * Retrouve ou crée l'état persistant d'un ingrédient automatique.
   *
   * QueryBuilder est utilisé pour gérer correctement les valeurs `NULL`
   * sur `recipeId` et `externalRecipeId` avec PostgreSQL.
   *
   * @param dto Données permettant d'identifier l'ingrédient automatique.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'état existant ou une nouvelle entité non encore sauvegardée.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   */
  private async findOrCreateAutoState(
    dto: UpdateShoppingAutoItemDto,
    userId: number,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { startOfWeek } = this.getWeekRange(dto.date);

    const recipeId = dto.recipeId ?? null;
    const externalRecipeId = dto.externalRecipeId ?? null;

    const query = this.autoStatesRepository
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('state.weekStart = :weekStart', {
        weekStart: startOfWeek,
      })
      .andWhere('state.ingredientName = :ingredientName', {
        ingredientName: dto.ingredientName,
      });

    if (recipeId !== null) {
      query.andWhere('state.recipeId = :recipeId', { recipeId });
    } else {
      query.andWhere('state.recipeId IS NULL');
    }

    if (externalRecipeId !== null) {
      query.andWhere('state.externalRecipeId = :externalRecipeId', {
        externalRecipeId,
      });
    } else {
      query.andWhere('state.externalRecipeId IS NULL');
    }

    const existingState = await query.getOne();

    if (existingState) {
      return existingState;
    }

    return this.autoStatesRepository.create({
      user,
      weekStart: startOfWeek,
      recipeId,
      externalRecipeId,
      ingredientName: dto.ingredientName,
      quantity: dto.quantity ?? '',
      unit: dto.unit ?? '',
      checked: false,
      hidden: false,
    });
  }

  /**
   * Extrait les ingrédients automatiques à partir du planning.
   *
   * Pour chaque ingrédient, la méthode recherche un état persistant existant.
   * Si l'état indique que l'ingrédient est masqué, il n'est pas ajouté
   * à la réponse. Sinon, il est renvoyé avec son état `checked`.
   *
   * @param mealPlans Liste des repas planifiés sur la semaine.
   * @param weekStart Date du lundi de la semaine.
   * @param autoStates États persistés des ingrédients automatiques.
   * @returns Liste des ingrédients automatiques formatés pour le frontend.
   */
  private extractAutomaticItems(
    mealPlans: any[],
    weekStart: string,
    autoStates: ShoppingListAutoState[],
  ) {
    const items: any[] = [];

    for (const mealPlan of mealPlans) {
      const ingredients = mealPlan.recipe?.ingredients ?? [];

      for (const ingredient of ingredients) {
        const recipeId =
          mealPlan.source === 'local' ? Number(mealPlan.recipe?.id) : null;

        const externalRecipeId =
          mealPlan.source === 'external' ? String(mealPlan.recipe?.id) : null;

        const state = autoStates.find(
          (autoState) =>
            autoState.weekStart === weekStart &&
            autoState.ingredientName === ingredient.name &&
            autoState.recipeId === recipeId &&
            autoState.externalRecipeId === externalRecipeId,
        );

        if (state?.hidden) {
          continue;
        }

        items.push({
          id: `auto-${mealPlan.id}-${ingredient.name}`,
          name: ingredient.name ?? '',
          quantity: ingredient.quantity ?? '',
          unit: ingredient.unit ?? '',
          checked: state?.checked ?? false,
          isManual: false,
          source: 'automatic',
          weekStart,
          recipeId,
          externalRecipeId,
        });
      }
    }

    return items;
  }

  /**
   * Calcule les bornes d'une semaine à partir d'une date.
   *
   * La semaine est calculée du lundi au dimanche.
   *
   * @param dateString Date de référence au format `YYYY-MM-DD`.
   * @returns Un objet contenant `startOfWeek` et `endOfWeek`.
   */
  private getWeekRange(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      startOfWeek: this.toDateOnly(monday),
      endOfWeek: this.toDateOnly(sunday),
    };
  }

  /**
   * Convertit une date JavaScript au format `YYYY-MM-DD`.
   *
   * @param date Date JavaScript à convertir.
   * @returns Date formatée au format `YYYY-MM-DD`.
   */
  private toDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
