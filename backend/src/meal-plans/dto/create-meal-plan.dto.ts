import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MealSource, MealType } from '../entities/meal-plan.entity';

export class CreateMealPlanDto {
  @IsDateString()
  date!: string;

  @IsEnum(MealType)
  mealType!: MealType;

  @IsEnum(MealSource)
  source!: MealSource;

  @ValidateIf((o) => o.source === MealSource.LOCAL)
  @IsInt()
  recipeId?: number;

  @ValidateIf((o) => o.source === MealSource.EXTERNAL)
  @IsString()
  externalRecipeId?: string;
}