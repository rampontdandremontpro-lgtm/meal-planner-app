import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO représentant un ingrédient lors de la création d'une recette locale.
 */
export class CreateRecipeIngredientDto {
  /**
   * Nom de l'ingrédient.
   */
  @IsString()
  @IsNotEmpty()
  name!: string;

  /**
   * Quantité de l'ingrédient.
   */
  @IsOptional()
  @IsString()
  quantity?: string;

  /**
   * Unité de mesure de l'ingrédient.
   */
  @IsOptional()
  @IsString()
  unit?: string;
}

/**
 * DTO utilisé pour créer une recette locale.
 *
 * Cette classe valide les données reçues lors de l'appel
 * à la route `POST /recipes`.
 *
 * Règles métier :
 * - `title` et `instructions` sont obligatoires ;
 * - `servings` doit être un entier supérieur ou égal à 1 si renseigné ;
 * - `ingredients` doit être un tableau d'objets valides.
 */
export class CreateRecipeDto {
  /**
   * Titre de la recette.
   */
  @IsString()
  @IsNotEmpty()
  title!: string;

  /**
   * Description courte de la recette.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Étapes de préparation de la recette.
   */
  @IsString()
  @IsNotEmpty()
  instructions!: string;

  /**
   * Catégorie de la recette.
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * URL de l'image de la recette.
   */
  @IsOptional()
  @IsString()
  imageUrl?: string;

  /**
   * Temps de préparation affiché.
   */
  @IsOptional()
  @IsString()
  prepTime?: string;

  /**
   * Nombre de portions.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  servings?: number;

  /**
   * Liste des ingrédients de la recette.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients!: CreateRecipeIngredientDto[];
}