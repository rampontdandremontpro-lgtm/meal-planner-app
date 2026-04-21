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

/**
 * Entité représentant un utilisateur de l'application.
 *
 * Règles métier :
 * - l'email doit être unique ;
 * - un utilisateur peut posséder plusieurs recettes locales ;
 * - un utilisateur peut avoir plusieurs meal plans ;
 * - un utilisateur peut avoir plusieurs items manuels de shopping list.
 */
@Entity('users')
export class User {
  /**
   * Identifiant unique de l'utilisateur.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nom complet de l'utilisateur.
   */
  @Column()
  name!: string;

  /**
   * Adresse email de l'utilisateur.
   */
  @Column({ unique: true })
  email!: string;

  /**
   * Mot de passe hashé de l'utilisateur.
   */
  @Column()
  password!: string;

  /**
   * Date de création du compte.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Recettes locales créées par l'utilisateur.
   */
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes!: Recipe[];

  /**
   * Meal plans appartenant à l'utilisateur.
   */
  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans!: MealPlan[];

  /**
   * Items manuels de liste de courses appartenant à l'utilisateur.
   */
  @OneToMany(() => ShoppingItem, (shoppingItem) => shoppingItem.user)
  shoppingItems!: ShoppingItem[];
}