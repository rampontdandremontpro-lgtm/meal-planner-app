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
   * Cette méthode enregistre une nouvelle recette personnelle en base de données
   * et la rattache à l'utilisateur authentifié. Les ingrédients reçus dans le DTO
   * sont également persistés avec la recette.
   *
   * Règles métier :
   * - seules les recettes locales sont créées ici ;
   * - la recette est automatiquement associée à l'utilisateur connecté ;
   * - les champs optionnels manquants sont remplacés par des valeurs par défaut ;
   * - les ingrédients sont créés à partir des données envoyées par le front.
   *
   * @param createRecipeDto Données complètes de la recette à créer.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns La recette locale créée, formatée pour la réponse API.
   *
   * @throws {NotFoundException} Si l'utilisateur connecté est introuvable.
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
   * Cette méthode recherche d'abord la recette locale de l'utilisateur,
   * supprime les anciens ingrédients enregistrés, puis remplace entièrement
   * les données de la recette par celles transmises dans le DTO.
   *
   * Règles métier :
   * - seule une recette locale appartenant à l'utilisateur peut être modifiée ;
   * - les anciens ingrédients sont supprimés avant l'enregistrement des nouveaux ;
   * - les recettes externes ne sont jamais modifiées dans cette méthode.
   *
   * @param id Identifiant de la recette locale à mettre à jour.
   * @param updateRecipeDto Nouvelles données de la recette.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns La recette locale mise à jour et formatée pour la réponse API.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
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
   * Cette méthode vérifie que la recette existe bien et qu'elle appartient
   * à l'utilisateur authentifié avant de la supprimer définitivement.
   *
   * Règles métier :
   * - seule une recette locale du user connecté peut être supprimée ;
   * - les recettes externes ne sont jamais concernées ;
   * - si la recette n'existe pas ou n'appartient pas au user,
   *   elle est considérée comme introuvable.
   *
   * @param id Identifiant de la recette locale à supprimer.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Un objet contenant un message de confirmation.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
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
   * Récupère les recettes visibles pour le contexte courant.
   *
   * Cette méthode interroge toujours TheMealDB pour obtenir les recettes externes.
   * Si un utilisateur est authentifié, ses recettes locales sont également
   * récupérées puis fusionnées avec les recettes externes.
   *
   * Règles métier :
   * - sans utilisateur connecté : seules les recettes externes sont renvoyées ;
   * - avec utilisateur connecté : les recettes externes et locales sont renvoyées ;
   * - le paramètre `search` est appliqué aux recherches externes et locales.
   *
   * @param search Mot-clé de recherche optionnel.
   * @param userId Identifiant de l'utilisateur connecté, s'il existe.
   * @returns Une liste de recettes externes uniquement, ou une liste fusionnée
   * avec les recettes locales de l'utilisateur connecté.
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
   * Cette méthode construit une requête sur les recettes locales stockées
   * en base de données et limite les résultats aux recettes appartenant
   * à l'utilisateur concerné. Un filtre textuel peut être appliqué
   * sur le titre ou la catégorie.
   *
   * Règles métier :
   * - seules les recettes locales de l'utilisateur demandé sont renvoyées ;
   * - la recherche porte sur le titre et la catégorie ;
   * - les résultats sont triés par date de création décroissante.
   *
   * @param userId Identifiant de l'utilisateur.
   * @param search Mot-clé de recherche optionnel.
   * @returns La liste des recettes locales de l'utilisateur.
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
   * Cette méthode permet d'obtenir le détail complet d'une recette locale
   * uniquement si elle appartient à l'utilisateur demandé.
   *
   * Règles métier :
   * - une recette locale d'un autre utilisateur ne doit pas être renvoyée ;
   * - si la recette n'existe pas ou n'appartient pas au user,
   *   elle est considérée comme introuvable.
   *
   * @param id Identifiant de la recette locale.
   * @param userId Identifiant de l'utilisateur authentifié.
   * @returns Le détail complet de la recette locale formatée pour l'API.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
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
   * Récupère l'entité locale complète d'une recette par son identifiant.
   *
   * Cette méthode renvoie l'entité TypeORM complète, avec ses relations utiles,
   * sans filtrer sur l'utilisateur propriétaire.
   *
   * Règles métier :
   * - elle est utile pour des traitements internes ;
   * - elle ne doit être utilisée que lorsque l'on a besoin de l'entité complète.
   *
   * @param id Identifiant de la recette locale.
   * @returns L'entité complète de la recette locale.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable.
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
   * Vérifie qu'une recette locale appartient bien à l'utilisateur demandé.
   *
   * Cette méthode est utilisée comme garde métier dans d'autres services,
   * notamment avant l'ajout d'une recette locale dans un meal plan.
   *
   * Règles métier :
   * - la recette doit exister ;
   * - la recette doit appartenir à l'utilisateur indiqué ;
   * - si ce n'est pas le cas, elle est considérée comme introuvable.
   *
   * @param id Identifiant de la recette locale.
   * @param userId Identifiant de l'utilisateur.
   * @returns L'entité recette autorisée pour cet utilisateur.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur demandé.
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
   * Cette méthode appelle le service externe chargé d'interroger TheMealDB
   * afin d'obtenir le détail d'une recette publique à partir de son identifiant.
   *
   * Règles métier :
   * - seules les recettes externes sont concernées ;
   * - la réponse est harmonisée par le service TheMealDbService ;
   * - si aucun résultat n'est trouvé, une exception est levée.
   *
   * @param id Identifiant externe de la recette.
   * @returns Le détail de la recette externe.
   *
   * @throws {NotFoundException} Si la recette externe est introuvable.
   */
  async findExternalById(id: string) {
    const recipe = await this.theMealDbService.findMealById(id);

    if (!recipe) {
      throw new NotFoundException('Recette externe introuvable');
    }

    return recipe;
  }
}