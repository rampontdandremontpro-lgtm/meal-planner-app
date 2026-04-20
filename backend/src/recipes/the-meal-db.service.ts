import { Injectable } from '@nestjs/common';
import axios from 'axios';

type ExternalRecipe = {
  id: string;
  title: string;
  category: string;
  instructions: string;
  image: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  source: 'external';
};

@Injectable()
export class TheMealDbService {
  private readonly baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  async searchMeals(search?: string): Promise<ExternalRecipe[]> {
    const url = search
      ? `${this.baseUrl}/search.php?s=${encodeURIComponent(search)}`
      : `${this.baseUrl}/search.php?s=`;

    const response = await axios.get(url);
    const meals = response.data?.meals ?? [];

    return meals.map((meal: any) => this.mapMeal(meal));
  }

  async findMealById(id: string): Promise<ExternalRecipe | null> {
    const url = `${this.baseUrl}/lookup.php?i=${encodeURIComponent(id)}`;
    const response = await axios.get(url);
    const meal = response.data?.meals?.[0];

    if (!meal) {
      return null;
    }

    return this.mapMeal(meal);
  }

  private mapMeal(meal: any): ExternalRecipe {
    const ingredients: {
      name: string;
      quantity: string;
      unit: string;
    }[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          name: ingredient.trim(),
          quantity: measure?.trim() || '',
          unit: '',
        });
      }
    }

    return {
      id: meal.idMeal,
      title: meal.strMeal ?? '',
      category: meal.strCategory ?? '',
      instructions: meal.strInstructions ?? '',
      image: meal.strMealThumb ?? '',
      ingredients,
      source: 'external',
    };
  }
}