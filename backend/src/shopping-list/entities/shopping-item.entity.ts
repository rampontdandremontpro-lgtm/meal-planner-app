import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('shopping_items')
export class ShoppingItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  quantity!: string;

  @Column({ nullable: true })
  unit!: string;

  @Column({ default: false })
  checked!: boolean;

  @Column({ default: false })
  isManual!: boolean;

  @Column({ type: 'date' })
  weekStart!: string;

  @ManyToOne(() => User, (user) => user.shoppingItems, {
    onDelete: 'CASCADE',
  })
  user!: User;
}