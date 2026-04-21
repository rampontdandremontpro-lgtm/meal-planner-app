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
 * DTO représentant un ingrédient lors de la mise à jour d'une recette locale.
 */
export class UpdateRecipeIngredientDto {
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
 * DTO utilisé pour mettre à jour une recette locale.
 *
 * Cette classe valide les données reçues lors de l'appel
 * à la route `PUT /recipes/:id`.
 *
 * Règles métier :
 * - `title` et `instructions` restent obligatoires ;
 * - `servings` doit être un entier supérieur ou égal à 1 si renseigné ;
 * - la liste des ingrédients remplace celle existante.
 */
export class UpdateRecipeDto {
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
   * Liste des ingrédients mise à jour.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  ingredients!: UpdateRecipeIngredientDto[];
}