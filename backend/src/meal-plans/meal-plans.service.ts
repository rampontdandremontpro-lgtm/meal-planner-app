import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/entities/recipe.entity';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { MealPlan, MealSource } from './entities/meal-plan.entity';

@Injectable()
export class MealPlansService {
  constructor(
    @InjectRepository(MealPlan)
    private readonly mealPlansRepository: Repository<MealPlan>,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  async create(createMealPlanDto: CreateMealPlanDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const existingMealPlan = await this.mealPlansRepository.findOne({
      where: {
        user: { id: userId },
        date: createMealPlanDto.date,
        mealType: createMealPlanDto.mealType,
      },
      relations: ['user'],
    });

    if (existingMealPlan) {
      throw new BadRequestException(
        'Un repas existe déjà pour ce jour et ce type de repas',
      );
    }

    let recipe: Recipe | null = null;
    let externalRecipeId: string | null = null;

    if (createMealPlanDto.source === MealSource.LOCAL) {
      if (!createMealPlanDto.recipeId) {
        throw new BadRequestException('recipeId est requis pour une recette locale');
      }

      const localRecipe = await this.recipesService.findOne(createMealPlanDto.recipeId);

      if (!localRecipe) {
        throw new NotFoundException('Recette locale introuvable');
      }

      recipe = await this.recipesService.findLocalEntityById(createMealPlanDto.recipeId);
      externalRecipeId = null;
    }

    if (createMealPlanDto.source === MealSource.EXTERNAL) {
      if (!createMealPlanDto.externalRecipeId) {
        throw new BadRequestException(
          'externalRecipeId est requis pour une recette externe',
        );
      }

      await this.recipesService.findExternalById(createMealPlanDto.externalRecipeId);
      externalRecipeId = createMealPlanDto.externalRecipeId;
      recipe = null;
    }

    const mealPlan = this.mealPlansRepository.create({
      date: createMealPlanDto.date,
      mealType: createMealPlanDto.mealType,
      source: createMealPlanDto.source,
      externalRecipeId,
      recipe,
      user,
    });

    const savedMealPlan = await this.mealPlansRepository.save(mealPlan);

    return this.formatMealPlan(savedMealPlan);
  }

  async findWeek(date: string, userId: number) {
    const { startOfWeek, endOfWeek } = this.getWeekRange(date);

    const mealPlans = await this.mealPlansRepository.find({
      where: {
        user: { id: userId },
        date: Between(startOfWeek, endOfWeek),
      },
      relations: ['user', 'recipe'],
      order: {
        date: 'ASC',
      },
    });

    const result = await Promise.all(
      mealPlans.map(async (mealPlan) => {
        if (mealPlan.source === MealSource.EXTERNAL && mealPlan.externalRecipeId) {
          const externalRecipe = await this.recipesService.findExternalById(
            mealPlan.externalRecipeId,
          );

          return {
            id: mealPlan.id,
            date: mealPlan.date,
            mealType: mealPlan.mealType,
            source: mealPlan.source,
            recipe: externalRecipe,
          };
        }

        return this.formatMealPlan(mealPlan);
      }),
    );

    return {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      items: result,
    };
  }

  private formatMealPlan(mealPlan: MealPlan) {
    return {
      id: mealPlan.id,
      date: mealPlan.date,
      mealType: mealPlan.mealType,
      source: mealPlan.source,
      recipe:
        mealPlan.source === MealSource.LOCAL
          ? mealPlan.recipe
            ? {
                id: mealPlan.recipe.id,
                title: mealPlan.recipe.title,
                description: mealPlan.recipe.description,
                instructions: mealPlan.recipe.instructions,
                category: mealPlan.recipe.category,
                ingredients: mealPlan.recipe.ingredients,
                source: 'local',
              }
            : null
          : null,
    };
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