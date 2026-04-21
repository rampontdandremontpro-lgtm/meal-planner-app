import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItem } from './entities/shopping-item.entity';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { UsersService } from '../users/users.service';
import { MealPlansService } from '../meal-plans/meal-plans.service';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingItem)
    private readonly shoppingItemsRepository: Repository<ShoppingItem>,
    private readonly usersService: UsersService,
    private readonly mealPlansService: MealPlansService,
  ) {}

  /**
   * Récupère la liste de courses de la semaine pour un utilisateur.
   *
   * Cette méthode fusionne deux sources de données :
   * - les ingrédients automatiques recalculés à partir du planning repas ;
   * - les éléments manuels enregistrés en base par l'utilisateur.
   *
   * Règles métier :
   * - les ingrédients automatiques ne sont pas stockés en base ;
   * - seuls les items manuels sont persistés et modifiables ;
   * - la semaine est calculée du lundi au dimanche à partir de la date fournie ;
   * - seuls les éléments de l'utilisateur demandé sont renvoyés.
   *
   * @param date Date de référence utilisée pour calculer la semaine.
   * @param userId Identifiant de l'utilisateur.
   * @returns La liste de courses hebdomadaire avec les bornes de semaine
   * et la fusion des items automatiques et manuels.
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

    const automaticItems = this.extractAutomaticItems(
      weekMealPlans.items,
      startOfWeek,
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
   * Ajoute un ingrédient manuel à la liste de courses.
   *
   * Cette méthode crée un item manuel stocké en base de données et le rattache
   * à la semaine correspondant à la date fournie dans le DTO.
   *
   * Règles métier :
   * - seuls les items manuels sont créés via cette méthode ;
   * - l'item est automatiquement associé à l'utilisateur connecté ;
   * - `weekStart` est calculé à partir de la date envoyée par le front ;
   * - l'item est créé avec `checked = false` et `isManual = true`.
   *
   * @param createShoppingItemDto Données nécessaires à la création de l'item manuel.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'item manuel créé en base.
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
   * Met à jour l'état `checked` d'un ingrédient manuel.
   *
   * Cette méthode permet de cocher ou décocher un item manuel appartenant
   * à l'utilisateur connecté.
   *
   * Règles métier :
   * - seuls les items manuels appartenant à l'utilisateur peuvent être modifiés ;
   * - cette méthode met à jour uniquement l'état `checked` ;
   * - si l'item n'existe pas ou n'appartient pas au user, il est considéré
   *   comme introuvable.
   *
   * @param id Identifiant de l'item à mettre à jour.
   * @param updateShoppingItemDto Nouveau statut de l'item.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns L'item mis à jour.
   *
   * @throws {NotFoundException} Si l'item est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
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
   * Supprime un ingrédient manuel appartenant à l'utilisateur.
   *
   * Cette méthode vérifie que l'item demandé existe bien et qu'il appartient
   * à l'utilisateur authentifié avant de le supprimer.
   *
   * Règles métier :
   * - seuls les items manuels de l'utilisateur connecté peuvent être supprimés ;
   * - les items automatiques ne sont pas concernés car ils ne sont pas stockés ;
   * - si l'item n'existe pas ou n'appartient pas au user, il est considéré
   *   comme introuvable.
   *
   * @param id Identifiant de l'item à supprimer.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Un objet contenant un message de confirmation.
   *
   * @throws {NotFoundException} Si l'item est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
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
   * Extrait les ingrédients automatiques à partir du planning hebdomadaire.
   *
   * Cette méthode parcourt les recettes associées aux meal plans de la semaine
   * et transforme leurs ingrédients en items de liste de courses temporaires.
   *
   * Règles métier :
   * - les items générés ici ne sont pas persistés en base ;
   * - chaque ingrédient est transformé en item distinct ;
   * - ces items sont marqués avec `isManual = false` et `source = automatic`.
   *
   * @param mealPlans Liste des repas de la semaine.
   * @param weekStart Date du début de semaine.
   * @returns Une liste d'items automatiques dérivés du planning.
   */
  private extractAutomaticItems(mealPlans: any[], weekStart: string) {
    const items: any[] = [];

    for (const mealPlan of mealPlans) {
      const ingredients = mealPlan.recipe?.ingredients ?? [];

      for (const ingredient of ingredients) {
        items.push({
          id: `auto-${mealPlan.id}-${ingredient.name}`,
          name: ingredient.name ?? '',
          quantity: ingredient.quantity ?? '',
          unit: ingredient.unit ?? '',
          checked: false,
          isManual: false,
          source: 'automatic',
          weekStart,
        });
      }
    }

    return items;
  }

  /**
   * Calcule le début et la fin de semaine à partir d'une date donnée.
   *
   * Cette méthode utilitaire renvoie les bornes hebdomadaires du lundi
   * au dimanche au format `YYYY-MM-DD`.
   *
   * @param dateString Date de référence.
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
   * Cette méthode est utilisée pour harmoniser le stockage et la comparaison
   * des dates de semaine dans le service.
   *
   * @param date Date JavaScript à convertir.
   * @returns La date formatée au format `YYYY-MM-DD`.
   */
  private toDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}