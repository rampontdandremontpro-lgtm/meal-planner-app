import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

export enum MealSource {
  LOCAL = 'local',
  EXTERNAL = 'external',
}

@Entity('meal_plans')
export class MealPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({
    type: 'enum',
    enum: MealType,
  })
  mealType!: MealType;

  @Column({
    type: 'enum',
    enum: MealSource,
    default: MealSource.LOCAL,
  })
  source!: MealSource;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  externalRecipeId!: string | null;

  @ManyToOne(() => User, (user) => user.mealPlans, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.mealPlans, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  recipe!: Recipe | null;
}