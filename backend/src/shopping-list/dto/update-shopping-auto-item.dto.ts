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
 * DTO utilisé pour modifier l'état d'un ingrédient automatique.
 *
 * Il permet de cocher, décocher ou masquer un ingrédient provenant
 * automatiquement du planning repas.
 */
export class UpdateShoppingAutoItemDto {
  @IsDateString()
  date!: string;

  @ValidateIf((o) => !o.externalRecipeId)
  @Type(() => Number)
  @IsInt()
  recipeId?: number;

  @ValidateIf((o) => !o.recipeId)
  @IsString()
  externalRecipeId?: string;

  @IsString()
  ingredientName!: string;

  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}