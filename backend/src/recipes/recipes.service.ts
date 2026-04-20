import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UsersService } from '../users/users.service';
import { TheMealDbService } from './the-meal-db.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly usersService: UsersService,
    private readonly theMealDbService: TheMealDbService,
  ) {}

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
      ingredients: savedRecipe.ingredients,
      source: 'local',
      user: savedRecipe.user,
      createdAt: savedRecipe.createdAt,
    };
  }

  async findAll(search?: string) {
    const localRecipes = await this.findLocalRecipes(search);
    const externalRecipes = await this.theMealDbService.searchMeals(search);

    return [...localRecipes, ...externalRecipes];
  }

  async findLocalRecipes(search?: string) {
    const recipes = search
      ? await this.recipesRepository.find({
          where: [
            { title: ILike(`%${search}%`) },
            { category: ILike(`%${search}%`) },
          ],
          relations: ['user'],
          order: { createdAt: 'DESC' },
        })
      : await this.recipesRepository.find({
          relations: ['user'],
          order: { createdAt: 'DESC' },
        });

    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      ingredients: recipe.ingredients,
      source: 'local' as const,
      user: recipe.user,
      createdAt: recipe.createdAt,
    }));
  }

  async findOne(id: number) {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable');
    }

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      ingredients: recipe.ingredients,
      source: 'local',
      user: recipe.user,
      createdAt: recipe.createdAt,
    };
  }

  async findLocalEntityById(id: number) {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!recipe) {
      throw new NotFoundException('Recette locale introuvable');
    }

    return recipe;
  }

  async findExternalById(id: string) {
    const recipe = await this.theMealDbService.findMealById(id);

    if (!recipe) {
      throw new NotFoundException('Recette externe introuvable');
    }

    return recipe;
  }
}