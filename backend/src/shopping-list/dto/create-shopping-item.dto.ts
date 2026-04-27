import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShoppingItemDto {
  @ApiProperty({
    example: 'Tomates',
    description: "Nom de l'article ou de l'ingrédient.",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: '2',
    description: "Quantité de l'article.",
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({
    example: 'pièces',
    description: "Unité de mesure de l'article.",
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({
    example: '2026-04-21',
    description: 'Date de référence pour la semaine.',
  })
  @IsString()
  @IsNotEmpty()
  date!: string;
}