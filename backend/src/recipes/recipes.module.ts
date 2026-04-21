import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { UsersModule } from '../users/users.module';
import { TheMealDbService } from './the-meal-db.service';

/**
 * Module dédié à la gestion des recettes.
 *
 * Ce module regroupe :
 * - le controller des routes `recipes` ;
 * - le service métier des recettes locales ;
 * - le service d'accès à TheMealDB ;
 * - les entités `Recipe` et `RecipeIngredient`.
 *
 * Rôle :
 * - gérer les recettes locales de l'utilisateur ;
 * - récupérer les recettes externes depuis TheMealDB ;
 * - exposer les méthodes utiles aux autres modules.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient]), UsersModule],
  controllers: [RecipesController],
  providers: [RecipesService, TheMealDbService],
  exports: [RecipesService],
})
export class RecipesModule {}