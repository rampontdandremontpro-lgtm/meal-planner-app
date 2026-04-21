import { IsBoolean } from 'class-validator';

/**
 * DTO utilisé pour mettre à jour l'état d'un item manuel
 * dans la liste de courses.
 */
export class UpdateShoppingItemDto {
  /**
   * Indique si l'item est coché ou non.
   */
  @IsBoolean()
  checked!: boolean;
}