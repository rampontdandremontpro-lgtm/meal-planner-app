import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { UsersModule } from '../users/users.module';
import { TheMealDbService } from './the-meal-db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeIngredient]),
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, TheMealDbService],
  exports: [RecipesService],
})
export class RecipesModule {}