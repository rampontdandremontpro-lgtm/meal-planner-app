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

  /**
   * Crée un repas dans le planning hebdomadaire.
   *
   * Cette méthode ajoute une entrée dans le planning de l'utilisateur
   * pour une date et un type de repas donnés. Le repas peut être lié
   * soit à une recette locale appartenant à l'utilisateur, soit à une
   * recette externe identifiée par son identifiant TheMealDB.
   *
   * Règles métier :
   * - un utilisateur ne peut avoir qu'un seul repas par date et type de repas ;
   * - si la source est `local`, un `recipeId` est obligatoire ;
   * - si la source est `external`, un `externalRecipeId` est obligatoire ;
   * - une recette locale doit appartenir à l'utilisateur connecté ;
   * - une recette externe doit exister dans la source externe.
   *
   * @param createMealPlanDto Données nécessaires à la création du meal plan.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Le meal plan créé, formaté pour la réponse API.
   *
   * @throws {NotFoundException} Si l'utilisateur est introuvable.
   * @throws {NotFoundException} Si la recette locale ou externe demandée est introuvable.
   * @throws {BadRequestException} Si un doublon existe déjà pour la même date
   * et le même type de repas, ou si un identifiant obligatoire est manquant.
   */
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
        throw new BadRequestException(
          'recipeId est requis pour une recette locale',
        );
      }

      recipe = await this.recipesService.ensureLocalRecipeBelongsToUser(
        createMealPlanDto.recipeId,
        userId,
      );
      externalRecipeId = null;
    }

    if (createMealPlanDto.source === MealSource.EXTERNAL) {
      if (!createMealPlanDto.externalRecipeId) {
        throw new BadRequestException(
          'externalRecipeId est requis pour une recette externe',
        );
      }

      await this.recipesService.findExternalById(
        createMealPlanDto.externalRecipeId,
      );

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

    return await this.formatMealPlan(savedMealPlan);
  }

  /**
   * Récupère le planning complet de la semaine pour un utilisateur.
   *
   * Cette méthode calcule les bornes de la semaine à partir de la date
   * fournie, puis recherche tous les meal plans de l'utilisateur dans
   * cet intervalle. Chaque entrée est ensuite formatée pour être utilisable
   * directement par le front.
   *
   * Règles métier :
   * - seuls les meal plans du user demandé sont renvoyés ;
   * - la semaine est calculée du lundi au dimanche ;
   * - les recettes externes sont enrichies via le service de recettes ;
   * - les recettes locales sont renvoyées dans un format harmonisé.
   *
   * @param date Date de référence utilisée pour calculer la semaine.
   * @param userId Identifiant de l'utilisateur.
   * @returns Un objet contenant le début de semaine, la fin de semaine
   * et la liste des meal plans formatés.
   */
  async findWeek(date: string, userId: number) {
    const { startOfWeek, endOfWeek } = this.getWeekRange(date);

    const mealPlans = await this.mealPlansRepository.find({
      where: {
        user: { id: userId },
        date: Between(startOfWeek, endOfWeek),
      },
      relations: ['user', 'recipe', 'recipe.ingredients'],
      order: {
        date: 'ASC',
      },
    });

    const items = await Promise.all(
      mealPlans.map((mealPlan) => this.formatMealPlan(mealPlan)),
    );

    return {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      items,
    };
  }

  /**
   * Supprime un meal plan appartenant à l'utilisateur connecté.
   *
   * Cette méthode vérifie qu'une entrée du planning correspond bien
   * à l'identifiant fourni et à l'utilisateur authentifié avant
   * de la supprimer définitivement.
   *
   * Règles métier :
   * - un utilisateur ne peut supprimer que ses propres meal plans ;
   * - si l'élément n'existe pas ou n'appartient pas au user,
   *   il est considéré comme introuvable.
   *
   * @param id Identifiant du meal plan à supprimer.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Un objet contenant un message de confirmation.
   *
   * @throws {NotFoundException} Si le meal plan est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  async remove(id: number, userId: number) {
    const mealPlan = await this.mealPlansRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!mealPlan) {
      throw new NotFoundException('Meal plan introuvable');
    }

    await this.mealPlansRepository.remove(mealPlan);

    return { message: 'Meal plan deleted' };
  }

  /**
   * Formate un meal plan pour la réponse API.
   *
   * Cette méthode transforme l'entité meal plan en objet de réponse
   * homogène pour le front. Si le repas est lié à une recette externe,
   * le détail est récupéré via le service des recettes. Si le repas
   * est lié à une recette locale, seules les données utiles sont exposées.
   *
   * Règles métier :
   * - une recette externe est rechargée à partir de son identifiant externe ;
   * - une recette locale est renvoyée dans un format simplifié ;
   * - si aucune recette locale n'est associée, la valeur `recipe` vaut `null`.
   *
   * @param mealPlan Entité meal plan à formater.
   * @returns Un objet prêt à être renvoyé au front.
   */
  private async formatMealPlan(mealPlan: MealPlan) {
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

    return {
      id: mealPlan.id,
      date: mealPlan.date,
      mealType: mealPlan.mealType,
      source: mealPlan.source,
      recipe: mealPlan.recipe
        ? {
            id: mealPlan.recipe.id,
            title: mealPlan.recipe.title,
            description: mealPlan.recipe.description,
            instructions: mealPlan.recipe.instructions,
            category: mealPlan.recipe.category,
            imageUrl: mealPlan.recipe.imageUrl,
            prepTime: mealPlan.recipe.prepTime,
            servings: mealPlan.recipe.servings,
            ingredients: mealPlan.recipe.ingredients,
            source: 'local',
          }
        : null,
    };
  }

  /**
   * Calcule le lundi et le dimanche de la semaine correspondant à la date donnée.
   *
   * Cette méthode utilitaire convertit une date de référence en intervalle
   * hebdomadaire complet, du lundi au dimanche, au format `YYYY-MM-DD`.
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
   * Cette méthode est utilisée pour harmoniser le format des dates
   * manipulées dans le service, notamment pour les bornes de semaine.
   *
   * @param date Date JavaScript à convertir.
   * @returns La date formatée sous forme de chaîne `YYYY-MM-DD`.
   */
  private toDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}