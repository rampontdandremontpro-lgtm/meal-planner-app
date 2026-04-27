import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingItem } from './entities/shopping-item.entity';
import { ShoppingListAutoState } from './entities/shopping-list-auto-state.entity';
import { UsersModule } from '../users/users.module';
import { MealPlansModule } from '../meal-plans/meal-plans.module';
import { RecipesModule } from '../recipes/recipes.module';

/**
 * Module dédié à la gestion de la liste de courses.
 *
 * Il gère :
 * - les items manuels persistés en base ;
 * - les ingrédients automatiques calculés depuis le planning ;
 * - l'état utilisateur des ingrédients automatiques.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingItem, ShoppingListAutoState]),
    UsersModule,
    MealPlansModule,
    RecipesModule,
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}