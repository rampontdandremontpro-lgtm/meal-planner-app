import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MealSource, MealType } from '../entities/meal-plan.entity';

/**
 * DTO utilisé pour créer un élément du planning repas.
 *
 * Cette classe valide les données envoyées lors de l'ajout
 * d'un repas dans le planning hebdomadaire.
 *
 * Règles métier :
 * - `date` doit être une date valide ;
 * - `mealType` doit appartenir à l'énumération `MealType` ;
 * - `source` doit appartenir à l'énumération `MealSource` ;
 * - si `source = local`, alors `recipeId` est requis ;
 * - si `source = external`, alors `externalRecipeId` est requis.
 */
export class CreateMealPlanDto {
  /**
   * Date du repas au format `YYYY-MM-DD`.
   */
  @IsDateString()
  date!: string;

  /**
   * Type de repas concerné.
   */
  @IsEnum(MealType)
  mealType!: MealType;

  /**
   * Source de la recette : locale ou externe.
   */
  @IsEnum(MealSource)
  source!: MealSource;

  /**
   * Identifiant d'une recette locale.
   *
   * Obligatoire uniquement si la source est `local`.
   */
  @ValidateIf((o) => o.source === MealSource.LOCAL)
  @IsInt()
  recipeId?: number;

  /**
   * Identifiant d'une recette externe.
   *
   * Obligatoire uniquement si la source est `external`.
   */
  @ValidateIf((o) => o.source === MealSource.EXTERNAL)
  @IsString()
  externalRecipeId?: string;
}