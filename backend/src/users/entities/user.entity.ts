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
 * Entité représentant un utilisateur de l'application Meal Planner.
 *
 * Un utilisateur peut créer des recettes locales, organiser son planning repas,
 * ajouter des items manuels à sa liste de courses et gérer l'état des ingrédients
 * automatiques issus du planning.
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
   * Adresse email unique utilisée pour la connexion.
   */
  @Column({ unique: true })
  email!: string;

  /**
   * Mot de passe hashé avec bcrypt.
   */
  @Column()
  password!: string;

  /**
   * Date de création du compte utilisateur.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Recettes locales créées par l'utilisateur.
   */
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes!: Recipe[];

  /**
   * Éléments du planning repas appartenant à l'utilisateur.
   */
  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans!: MealPlan[];

  /**
   * Items manuels ajoutés à la liste de courses.
   */
  @OneToMany(() => ShoppingItem, (shoppingItem) => shoppingItem.user)
  shoppingItems!: ShoppingItem[];

  /**
   * États persistés des ingrédients automatiques de la liste de courses.
   */
  @OneToMany(() => ShoppingListAutoState, (state) => state.user)
  shoppingListAutoStates!: ShoppingListAutoState[];
}
