import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingItem } from './entities/shopping-item.entity';
import { UsersModule } from '../users/users.module';
import { MealPlansModule } from '../meal-plans/meal-plans.module';
import { RecipesModule } from '../recipes/recipes.module';

/**
 * Module dédié à la gestion de la liste de courses.
 *
 * Ce module regroupe :
 * - le controller des routes `shopping-list` ;
 * - le service métier de la liste de courses ;
 * - l'entité `ShoppingItem` ;
 * - les dépendances vers les utilisateurs, meal plans et recettes.
 *
 * Rôle :
 * - recalculer les ingrédients automatiques depuis le planning ;
 * - gérer les items manuels stockés en base ;
 * - fournir la liste hebdomadaire complète.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingItem]),
    UsersModule,
    MealPlansModule,
    RecipesModule,
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}