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

  private toDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}