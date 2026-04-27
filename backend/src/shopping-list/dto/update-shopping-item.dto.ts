import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

/**
 * DTO utilisé pour cocher ou décocher un item manuel.
 *
 * Ce DTO est utilisé par la route `PATCH /shopping-list/items/:id`.
 */
export class UpdateShoppingItemDto {
  /**
   * Nouvel état de l'item manuel.
   */
  @ApiProperty({
    example: true,
    description: "Indique si l'item manuel est coché.",
  })
  @IsBoolean()
  checked!: boolean;
}
