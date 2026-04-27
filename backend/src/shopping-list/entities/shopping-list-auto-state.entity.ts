import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Entité qui stocke l'état utilisateur d'un ingrédient automatique.
 *
 * Les ingrédients automatiques viennent toujours du planning repas.
 * Cette table ne remplace pas les ingrédients d'origine :
 * elle stocke uniquement l'état choisi par un utilisateur pour une semaine.
 *
 * Règles métier :
 * - `checked` permet de cocher ou décocher un ingrédient automatique ;
 * - `hidden` permet de masquer l'ingrédient dans la liste de courses ;
 * - l'état est propre à un utilisateur et ne modifie pas les autres comptes ;
 * - la recette et le planning ne sont jamais modifiés par cette entité.
 */
@Entity('shopping_list_auto_states')
export class ShoppingListAutoState {
  /**
   * Identifiant unique de l'état persistant.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Date du lundi de la semaine concernée.
   */
  @Column({ type: 'date' })
  weekStart!: string;

  /**
   * Identifiant de la recette locale si l'ingrédient vient d'une recette locale.
   */
  @Column({ type: 'int', nullable: true })
  recipeId!: number | null;

  /**
   * Identifiant de la recette externe si l'ingrédient vient de TheMealDB.
   */
  @Column({ type: 'varchar', nullable: true })
  externalRecipeId!: string | null;

  /**
   * Nom de l'ingrédient automatique.
   */
  @Column()
  ingredientName!: string;

  /**
   * Quantité affichée pour l'ingrédient.
   */
  @Column({ nullable: true })
  quantity!: string;

  /**
   * Unité de mesure affichée pour l'ingrédient.
   */
  @Column({ nullable: true })
  unit!: string;

  /**
   * Indique si l'ingrédient automatique est coché.
   */
  @Column({ default: false })
  checked!: boolean;

  /**
   * Indique si l'ingrédient automatique est masqué de la liste.
   */
  @Column({ default: false })
  hidden!: boolean;

  /**
   * Utilisateur propriétaire de cet état.
   */
  @ManyToOne(() => User, (user) => user.shoppingListAutoStates, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
