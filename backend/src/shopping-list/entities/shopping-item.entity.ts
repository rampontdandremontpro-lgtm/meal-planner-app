import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Entité représentant un item manuel de la liste de courses.
 *
 * Règles métier :
 * - seuls les items manuels sont stockés en base ;
 * - chaque item appartient à un utilisateur ;
 * - `weekStart` permet de rattacher l'item à une semaine précise.
 */
@Entity('shopping_items')
export class ShoppingItem {
  /**
   * Identifiant unique de l'item.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nom de l'article ou de l'ingrédient.
   */
  @Column()
  name!: string;

  /**
   * Quantité de l'article.
   */
  @Column({ nullable: true })
  quantity!: string;

  /**
   * Unité de mesure de l'article.
   */
  @Column({ nullable: true })
  unit!: string;

  /**
   * Indique si l'item a été coché.
   */
  @Column({ default: false })
  checked!: boolean;

  /**
   * Indique que l'item a été ajouté manuellement.
   */
  @Column({ default: true })
  isManual!: boolean;

  /**
   * Date du lundi de la semaine concernée.
   */
  @Column({ type: 'date' })
  weekStart!: string;

  /**
   * Utilisateur propriétaire de l'item.
   */
  @ManyToOne(() => User, (user) => user.shoppingItems, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
