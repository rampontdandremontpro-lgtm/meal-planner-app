import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

/**
 * Types de repas autorisés dans le planning hebdomadaire.
 */
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

/**
 * Sources possibles d'une recette dans le planning.
 */
export enum MealSource {
  LOCAL = 'local',
  EXTERNAL = 'external',
}

/**
 * Entité représentant un élément du planning repas d'un utilisateur.
 *
 * Un meal plan correspond à un repas précis pour une date donnée,
 * un type de repas donné et un utilisateur donné.
 *
 * Règles métier :
 * - un meal plan appartient toujours à un utilisateur ;
 * - il peut pointer soit vers une recette locale, soit vers une recette externe ;
 * - si la recette est externe, `externalRecipeId` est renseigné ;
 * - si la recette est locale, la relation `recipe` est renseignée.
 */
@Entity('meal_plans')
export class MealPlan {
  /**
   * Identifiant unique du meal plan.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Date du repas au format `YYYY-MM-DD`.
   */
  @Column({ type: 'date' })
  date!: string;

  /**
   * Type de repas planifié.
   */
  @Column({
    type: 'enum',
    enum: MealType,
  })
  mealType!: MealType;

  /**
   * Source de la recette liée au meal plan.
   */
  @Column({
    type: 'enum',
    enum: MealSource,
    default: MealSource.LOCAL,
  })
  source!: MealSource;

  /**
   * Identifiant de recette externe si la source est `external`.
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  externalRecipeId!: string | null;

  /**
   * Utilisateur propriétaire du meal plan.
   */
  @ManyToOne(() => User, (user) => user.mealPlans, { onDelete: 'CASCADE' })
  user!: User;

  /**
   * Recette locale liée au meal plan, si la source est `local`.
   */
  @ManyToOne(() => Recipe, (recipe) => recipe.mealPlans, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  recipe!: Recipe | null;
}
