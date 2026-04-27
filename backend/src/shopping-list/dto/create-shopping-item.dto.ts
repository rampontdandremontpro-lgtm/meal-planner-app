import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO utilisé pour ajouter un ingrédient manuel à la liste de courses.
 *
 * Ce DTO valide les données envoyées par le frontend lors de l'appel
 * `POST /shopping-list/items`.
 */
export class CreateShoppingItemDto {
  /**
   * Nom de l'article ou de l'ingrédient manuel.
   */
  @ApiProperty({
    example: 'Tomates',
    description: "Nom de l'article ou de l'ingrédient.",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  /**
   * Quantité de l'article.
   */
  @ApiPropertyOptional({
    example: '2',
    description: "Quantité de l'article.",
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  /**
   * Unité de mesure de l'article.
   */
  @ApiPropertyOptional({
    example: 'pièces',
    description: "Unité de mesure de l'article.",
  })
  @IsOptional()
  @IsString()
  unit?: string;

  /**
   * Date de référence utilisée pour rattacher l'item à une semaine.
   */
  @ApiProperty({
    example: '2026-04-21',
    description: 'Date de référence pour la semaine.',
  })
  @IsString()
  @IsNotEmpty()
  date!: string;
}
