import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Tomates',
    description: "Nom de l'ingrédient.",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: '2',
    description: "Quantité de l'ingrédient.",
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({
    example: 'pièces',
    description: "Unité de mesure de l'ingrédient.",
  })
  @IsOptional()
  @IsString()
  unit?: string;
}

/**
 * DTO utilisé pour créer une recette locale.
 *
 * Il valide les informations générales de la recette ainsi que la liste
 * des ingrédients associés.
 */
export class CreateRecipeDto {
  @ApiProperty({
    example: 'Salade de tomates',
    description: 'Titre de la recette.',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Une recette simple et rapide.',
    description: 'Description courte de la recette.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Couper les tomates puis assaisonner.',
    description: 'Instructions de préparation.',
  })
  @IsString()
  @IsNotEmpty()
  instructions!: string;

  @ApiPropertyOptional({
    example: 'Entrée',
    description: 'Catégorie de la recette.',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'https://exemple.com/image.jpg',
    description: "URL de l'image de la recette.",
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: '15 min',
    description: 'Temps de préparation.',
  })
  @IsOptional()
  @IsString()
  prepTime?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Nombre de portions.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiProperty({
    type: [CreateRecipeIngredientDto],
    description: 'Liste des ingrédients de la recette.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients!: CreateRecipeIngredientDto[];
}
