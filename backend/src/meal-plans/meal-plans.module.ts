import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlansController } from './meal-plans.controller';
import { MealPlansService } from './meal-plans.service';
import { MealPlan } from './entities/meal-plan.entity';
import { UsersModule } from '../users/users.module';
import { RecipesModule } from '../recipes/recipes.module';

/**
 * Module dédié à la gestion du planning repas.
 *
 * Ce module regroupe :
 * - le controller des routes `meal-plans` ;
 * - le service métier de gestion du planning ;
 * - l'entité `MealPlan` ;
 * - les dépendances vers les utilisateurs et les recettes.
 *
 * Rôle :
 * - créer des repas dans le planning ;
 * - récupérer le planning hebdomadaire ;
 * - supprimer un élément du planning.
 */
@Module({
  imports: [TypeOrmModule.forFeature([MealPlan]), UsersModule, RecipesModule],
  controllers: [MealPlansController],
  providers: [MealPlansService],
  exports: [MealPlansService],
})
export class MealPlansModule {}