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

export class UpdateRecipeIngredientDto {
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

export class UpdateRecipeDto {
  @ApiProperty({
    example: 'Salade de tomates modifiée',
    description: 'Titre de la recette.',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Une recette mise à jour.',
    description: 'Description courte de la recette.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Couper les tomates puis ajouter la vinaigrette.',
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
    example: '20 min',
    description: 'Temps de préparation.',
  })
  @IsOptional()
  @IsString()
  prepTime?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Nombre de portions.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiProperty({
    type: [UpdateRecipeIngredientDto],
    description: 'Nouvelle liste des ingrédients.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  ingredients!: UpdateRecipeIngredientDto[];
}