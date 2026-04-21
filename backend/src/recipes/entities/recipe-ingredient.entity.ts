import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

/**
 * Entité représentant un ingrédient d'une recette locale.
 *
 * Chaque ingrédient appartient à une seule recette.
 */
@Entity('recipe_ingredients')
export class RecipeIngredient {
  /**
   * Identifiant unique de l'ingrédient.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nom de l'ingrédient.
   */
  @Column()
  name!: string;

  /**
   * Quantité de l'ingrédient.
   */
  @Column({ nullable: true })
  quantity!: string;

  /**
   * Unité de mesure de l'ingrédient.
   */
  @Column({ nullable: true })
  unit!: string;

  /**
   * Recette propriétaire de l'ingrédient.
   */
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  recipe!: Recipe;
}