import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Entité qui stocke l'état utilisateur d'un ingrédient automatique.
 *
 * Les ingrédients automatiques viennent toujours du planning repas.
 * Cette table ne remplace donc pas les ingrédients d'origine :
 * elle stocke uniquement si un utilisateur a coché ou masqué un ingrédient
 * automatique pour une semaine donnée.
 */
@Entity('shopping_list_auto_states')
export class ShoppingListAutoState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  weekStart!: string;

  @Column({ type: 'int', nullable: true })
  recipeId!: number | null;

  @Column({ type: 'varchar', nullable: true })
  externalRecipeId!: string | null;

  @Column()
  ingredientName!: string;

  @Column({ nullable: true })
  quantity!: string;

  @Column({ nullable: true })
  unit!: string;

  @Column({ default: false })
  checked!: boolean;

  @Column({ default: false })
  hidden!: boolean;

  @ManyToOne(() => User, (user) => user.shoppingListAutoStates, {
    onDelete: 'CASCADE',
  })
  user!: User;
}