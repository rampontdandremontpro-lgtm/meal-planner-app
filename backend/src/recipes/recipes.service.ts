import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { UsersService } from '../users/users.service';
import { TheMealDbService } from './the-meal-db.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientsRepository: Repository<RecipeIngredient>,
    private readonly usersService: UsersService,
    private readonly theMealDbService: TheMealDbService,
  ) {}

  /**
   * Crée une recette locale liée à l'utilisateur connecté.
   *
   * @param createRecipeDto Données de la recette
   * @param userId Identifiant de l'utilisateur connecté
   * @returns Recette locale créée
   */
  async create(createRecipeDto: CreateRecipeDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const recipe = this.recipesRepository.create({
      title: createRecipeDto.title,
      description: createRecipeDto.description ?? '',
      instructions: createRecipeDto.instructions,
      category: createRecipeDto.category ?? '',
      imageUrl: createRecipeDto.imageUrl ?? '',
      prepTime: createRecipeDto.prepTime ?? '',
      servings: createRecipeDto.servings ?? null,
      ingredients: createRecipeDto.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity ?? '',
        unit: ingredient.unit ?? '',
      })),
      user,
    });

    const savedRecipe = await this.recipesRepository.save(recipe);

    return {
      id: savedRecipe.id,
      title: savedRecipe.title,
      description: savedRecipe.description,
      instructions: savedRecipe.instructions,
      category: savedRecipe.category,
      imageUrl: savedRecipe.imageUrl,
      prepTime: savedRecipe.prepTime,
      servings: savedRecipe.servings,
      ingredients: savedRecipe.ingredients,
      source: 'local',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      createdAt: savedRecipe.createdAt,
    };
  }

  /**
   * Met à jour une recette locale appartenant à l'utilisateur connecté.
   *
   * @param id Identifiant de la recette
   * @param updateRecipeDto Nouvelles données
   * @param userId Identifiant de l'utilisateur connecté
   * @returns Recette mise à jour
   */
  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number) {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user', 'ingredients'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    await this.recipeIngredientsRepository.remove(recipe.ingredients);

    recipe.title = updateRecipeDto.title;
    recipe.description = updateRecipeDto.description ?? '';
    recipe.instructions = updateRecipeDto.instructions;
    recipe.category = updateRecipeDto.category ?? '';
    recipe.imageUrl = updateRecipeDto.imageUrl ?? '';
    recipe.prepTime = updateRecipeDto.prepTime ?? '';
    recipe.servings = updateRecipeDto.servings ?? null;
    recipe.ingredients = updateRecipeDto.ingredients.map((ingredient) =>
      this.recipeIngredientsRepository.create({
        name: ingredient.name,
        quantity: ingredient.quantity ?? '',
        unit: ingredient.unit ?? '',
      }),
    );

    const savedRecipe = await this.recipesRepository.save(recipe);

    return {
      id: savedRecipe.id,
      title: savedRecipe.title,
      description: savedRecipe.description,
      instructions: savedRecipe.instructions,
      category: savedRecipe.category,
      imageUrl: savedRecipe.imageUrl,
      prepTime: savedRecipe.prepTime,
      servings: savedRecipe.servings,
      ingredients: savedRecipe.ingredients,
      source: 'local',
      user: {
        id: recipe.user.id,
        name: recipe.user.name,
        email: recipe.user.email,
      },
      createdAt: savedRecipe.createdAt,
    };
  }

  /**
   * Supprime une recette locale appartenant à l'utilisateur connecté.
   *
   * @param id Identifiant de la recette
   * @param userId Identifiant de l'utilisateur connecté
   * @returns Message de confirmation
   */
  async remove(id: number, userId: number) {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user', 'ingredients'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    await this.recipesRepository.remove(recipe);

    return {
      message: 'Recipe deleted',
    };
  }

  /**
   * Récupère les recettes externes et, si l'utilisateur est connecté,
   * ajoute aussi ses recettes locales.
   *
   * @param search Mot-clé de recherche
   * @param userId Identifiant de l'utilisateur connecté
   * @returns Liste fusionnée des recettes
   */
  async findAll(search?: string, userId?: number) {
    const externalRecipes = await this.theMealDbService.searchMeals(search);

    if (!userId) {
      return externalRecipes;
    }

    const localRecipes = await this.findLocalRecipesForUser(userId, search);

    return [...externalRecipes, ...localRecipes];
  }

  /**
   * Récupère les recettes locales de l'utilisateur connecté.
   *
   * @param userId Identifiant utilisateur
   * @param search Mot-clé de recherche
   * @returns Liste des recettes locales
   */
  async findLocalRecipesForUser(userId: number, search?: string) {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .where('user.id = :userId', { userId })
      .orderBy('recipe.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(recipe.title ILIKE :search OR recipe.category ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const recipes = await queryBuilder.getMany();

    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      source: 'local' as const,
      user: {
        id: recipe.user.id,
        name: recipe.user.name,
        email: recipe.user.email,
      },
      createdAt: recipe.createdAt,
    }));
  }

  /**
   * Récupère une recette locale appartenant à l'utilisateur connecté.
   *
   * @param id Identifiant recette
   * @param userId Identifiant utilisateur
   * @returns Détail recette locale
   */
  async findOneLocalForUser(id: number, userId: number) {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user', 'ingredients'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      source: 'local',
      user: {
        id: recipe.user.id,
        name: recipe.user.name,
        email: recipe.user.email,
      },
      createdAt: recipe.createdAt,
    };
  }

  /**
   * Récupère l'entité locale complète par id.
   *
   * @param id Identifiant recette
   * @returns Entité recette
   */
  async findLocalEntityById(id: number) {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['user', 'ingredients'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    return recipe;
  }

  /**
   * Vérifie qu'une recette locale appartient bien à l'utilisateur.
   *
   * @param id Identifiant recette
   * @param userId Identifiant utilisateur
   * @returns Entité recette autorisée
   */
  async ensureLocalRecipeBelongsToUser(id: number, userId: number) {
    const recipe = await this.recipesRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user', 'ingredients'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    return recipe;
  }

  /**
   * Récupère une recette externe via TheMealDB.
   *
   * @param id Identifiant externe
   * @returns Détail recette externe
   */
  async findExternalById(id: string) {
    const recipe = await this.theMealDbService.findMealById(id);

    if (!recipe) {
      throw new NotFoundException('Recette externe introuvable');
    }

    return recipe;
  }
}