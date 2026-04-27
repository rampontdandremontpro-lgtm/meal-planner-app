import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateShoppingItemDto {
  @ApiProperty({
    example: true,
    description: "Indique si l'item manuel est coché.",
  })
  @IsBoolean()
  checked!: boolean;
}