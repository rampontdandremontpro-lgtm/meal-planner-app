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