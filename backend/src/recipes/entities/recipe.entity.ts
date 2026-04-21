import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { MealPlan } from '../../meal-plans/entities/meal-plan.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('text')
  instructions!: string;

  @Column({ nullable: true })
  category!: string;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ nullable: true })
  prepTime!: string;

  @Column({ type: 'int', nullable: true })
  servings!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.recipes, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user!: User;

  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    eager: true,
  })
  ingredients!: RecipeIngredient[];

  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.recipe)
  mealPlans!: MealPlan[];
}