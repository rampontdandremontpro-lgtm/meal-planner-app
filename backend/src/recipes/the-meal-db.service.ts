import { Injectable } from '@nestjs/common';
import axios from 'axios';

type ExternalRecipe = {
  id: string;
  title: string;
  category: string;
  instructions: string;
  imageUrl: string;
  prepTime: string;
  servings: number | null;
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
    const query = search?.trim();

    const response = query
      ? await axios.get(`${this.baseUrl}/search.php`, {
          params: { s: query },
        })
      : await axios.get(`${this.baseUrl}/search.php`, {
          params: { f: 'a' },
        });

    let meals = response.data?.meals ?? [];

    if (!Array.isArray(meals)) {
      meals = meals ? [meals] : [];
    }

    return meals.map((meal: any) => this.mapMeal(meal));
  }

  async findMealById(id: string): Promise<ExternalRecipe | null> {
    const response = await axios.get(`${this.baseUrl}/lookup.php`, {
      params: { i: id },
    });

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
      id: String(meal.idMeal),
      title: meal.strMeal ?? '',
      category: meal.strCategory ?? '',
      instructions: meal.strInstructions ?? '',
      imageUrl: meal.strMealThumb ?? '',
      prepTime: '',
      servings: null,
      ingredients,
      source: 'external',
    };
  }
}
