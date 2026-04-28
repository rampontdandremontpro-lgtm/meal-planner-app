import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO utilisé pour gérer l'état d'un ingrédient automatique.
 *
 * Ce DTO permet de cocher, décocher ou masquer un ingrédient issu du planning
 * sans modifier la recette, le planning ou l'ingrédient d'origine.
 */
export class UpdateShoppingAutoItemDto {
  @ApiProperty({
    example: '2026-04-21',
    description: 'Date de référence pour la semaine.',
  })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Identifiant de la recette locale.',
  })
  @ValidateIf((o) => !o.externalRecipeId)
  @Type(() => Number)
  @IsInt()
  recipeId?: number;

  @ApiPropertyOptional({
    example: '52772',
    description: 'Identifiant de la recette externe.',
  })
  @ValidateIf((o) => !o.recipeId)
  @IsString()
  externalRecipeId?: string;

  @ApiProperty({
    example: 'Tomates',
    description: "Nom de l'ingrédient automatique.",
  })
  @IsString()
  ingredientName!: string;

  @ApiPropertyOptional({
    example: '2',
    description: "Quantité de l'ingrédient.",
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({
    example: 'pièces',
    description: "Unité de l'ingrédient.",
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    example: true,
    description: "Permet de cocher ou décocher l'ingrédient automatique.",
  })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Permet de masquer l'ingrédient automatique.",
  })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
