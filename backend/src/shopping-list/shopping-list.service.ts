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
   * Récupère la liste de courses de la semaine.
   * Elle fusionne :
   * - les ingrédients automatiques issus du planning
   * - les ingrédients manuels stockés en base
   *
   * @param date Date de référence
   * @param userId Identifiant utilisateur
   * @returns Liste de courses hebdomadaire
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
   * @param createShoppingItemDto Données de l'ingrédient
   * @param userId Identifiant utilisateur
   * @returns Item créé
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
   * Met à jour l'état checked d'un ingrédient manuel.
   *
   * @param id Identifiant item
   * @param updateShoppingItemDto Nouveau statut
   * @param userId Identifiant utilisateur
   * @returns Item mis à jour
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
   * @param id Identifiant item
   * @param userId Identifiant utilisateur
   * @returns Message de confirmation
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
   * Extrait les ingrédients automatiques à partir du planning.
   *
   * @param mealPlans Liste des repas de la semaine
   * @param weekStart Début de semaine
   * @returns Liste d'items automatiques
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
   * Calcule le début et la fin de semaine à partir d'une date.
   *
   * @param dateString Date de référence
   * @returns Début et fin de semaine
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
   * Convertit une date au format YYYY-MM-DD.
   *
   * @param date Date JS
   * @returns Date formatée
   */
  private toDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}