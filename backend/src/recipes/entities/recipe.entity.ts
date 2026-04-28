import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { MealPlan } from '../../meal-plans/entities/meal-plan.entity';

/**
 * Entité représentant une recette locale créée par un utilisateur.
 *
 * Règles métier :
 * - une recette locale appartient à un seul utilisateur ;
 * - une recette possède plusieurs ingrédients ;
 * - une recette peut être utilisée dans plusieurs meal plans.
 */
@Entity('recipes')
export class Recipe {
  /**
   * Identifiant unique de la recette.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Titre de la recette.
   */
  @Column()
  title!: string;

  /**
   * Description courte de la recette.
   */
  @Column({ nullable: true })
  description!: string;

  /**
   * Instructions détaillées de préparation.
   */
  @Column('text')
  instructions!: string;

  /**
   * Catégorie de la recette.
   */
  @Column({ nullable: true })
  category!: string;

  /**
   * URL de l'image de la recette.
   */
  @Column({ nullable: true })
  imageUrl!: string;

  /**
   * Temps de préparation affiché.
   */
  @Column({ nullable: true })
  prepTime!: string;

  /**
   * Nombre de portions.
   */
  @Column({ type: 'int', nullable: true })
  servings!: number | null;

  /**
   * Date de création de la recette.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Utilisateur propriétaire de la recette.
   */
  @ManyToOne(() => User, (user) => user.recipes, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user!: User;

  /**
   * Liste des ingrédients de la recette.
   */
  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    eager: true,
  })
  ingredients!: RecipeIngredient[];

  /**
   * Meal plans utilisant cette recette locale.
   */
  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.recipe)
  mealPlans!: MealPlan[];
}
