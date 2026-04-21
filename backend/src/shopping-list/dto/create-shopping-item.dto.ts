import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO utilisé pour créer un ingrédient manuel dans la liste de courses.
 *
 * Cette classe valide les données reçues lors de l'appel
 * à la route `POST /shopping-list/items`.
 */
export class CreateShoppingItemDto {
  /**
   * Nom de l'article ou de l'ingrédient.
   */
  @IsString()
  @IsNotEmpty()
  name!: string;

  /**
   * Quantité de l'article.
   */
  @IsOptional()
  @IsString()
  quantity?: string;

  /**
   * Unité de mesure de l'article.
   */
  @IsOptional()
  @IsString()
  unit?: string;

  /**
   * Date de référence permettant de calculer la semaine concernée.
   */
  @IsString()
  @IsNotEmpty()
  date!: string;
}