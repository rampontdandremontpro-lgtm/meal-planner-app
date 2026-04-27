import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealSource, MealType } from '../entities/meal-plan.entity';

/**
 * DTO utilisé pour ajouter une recette au planning repas.
 *
 * Il valide la date, le type de repas, la source de recette et l'identifiant
 * nécessaire selon que la recette soit locale ou externe.
 */
export class CreateMealPlanDto {
  @ApiProperty({
    example: '2026-04-21',
    description: 'Date du repas au format YYYY-MM-DD.',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    enum: MealType,
    example: MealType.LUNCH,
    description: 'Type de repas.',
  })
  @IsEnum(MealType)
  mealType!: MealType;

  @ApiProperty({
    enum: MealSource,
    example: MealSource.EXTERNAL,
    description: 'Source de la recette.',
  })
  @IsEnum(MealSource)
  source!: MealSource;

  @ApiPropertyOptional({
    example: 1,
    description: 'Identifiant de la recette locale si source = local.',
  })
  @ValidateIf((o) => o.source === MealSource.LOCAL)
  @Type(() => Number)
  @IsInt()
  recipeId?: number;

  @ApiPropertyOptional({
    example: '52772',
    description: 'Identifiant de la recette externe si source = external.',
  })
  @ValidateIf((o) => o.source === MealSource.EXTERNAL)
  @IsString()
  externalRecipeId?: string;
}