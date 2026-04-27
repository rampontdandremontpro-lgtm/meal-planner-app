import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { MealPlan } from '../../meal-plans/entities/meal-plan.entity';
import { ShoppingItem } from '../../shopping-list/entities/shopping-item.entity';
import { ShoppingListAutoState } from '../../shopping-list/entities/shopping-list-auto-state.entity';

/**
 * Entité représentant un utilisateur de l'application.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes!: Recipe[];

  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans!: MealPlan[];

  @OneToMany(() => ShoppingItem, (shoppingItem) => shoppingItem.user)
  shoppingItems!: ShoppingItem[];

  @OneToMany(() => ShoppingListAutoState, (state) => state.user)
  shoppingListAutoStates!: ShoppingListAutoState[];
}