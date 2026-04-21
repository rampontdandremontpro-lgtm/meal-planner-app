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

  /**
   * Recherche des recettes externes via TheMealDB.
   *
   * Cette méthode interroge l'API TheMealDB pour récupérer une liste
   * de recettes publiques. Si aucun mot-clé n'est fourni, un fallback
   * sur la lettre `a` est utilisé afin de renvoyer des résultats par défaut.
   *
   * Règles métier :
   * - si `search` est renseigné, la recherche se fait avec `search.php?s=...` ;
   * - sinon, un fallback utilise `search.php?f=a` ;
   * - les recettes renvoyées sont harmonisées dans le format attendu par le backend.
   *
   * @param search Mot-clé de recherche optionnel.
   * @returns Une liste de recettes externes harmonisées.
   */
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

  /**
   * Récupère le détail d'une recette externe par son identifiant.
   *
   * Cette méthode interroge l'API TheMealDB avec `lookup.php?i=...`
   * puis harmonise la réponse obtenue.
   *
   * Règles métier :
   * - si aucun résultat n'est trouvé, la méthode renvoie `null` ;
   * - la recette retournée suit le format externe attendu par l'application.
   *
   * @param id Identifiant externe de la recette dans TheMealDB.
   * @returns La recette externe harmonisée ou `null` si elle n'existe pas.
   */
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

  /**
   * Convertit une recette brute TheMealDB vers le format externe de l'application.
   *
   * Cette méthode extrait les champs utiles de la réponse distante,
   * reconstruit la liste des ingrédients et renvoie un objet harmonisé
   * utilisé partout dans le backend.
   *
   * Règles métier :
   * - les ingrédients vides sont ignorés ;
   * - les mesures sont stockées dans `quantity` ;
   * - le champ `unit` reste vide car TheMealDB ne le sépare pas proprement ;
   * - `prepTime` et `servings` ne sont pas fournis par l'API et gardent
   *   donc des valeurs par défaut.
   *
   * @param meal Objet brut renvoyé par TheMealDB.
   * @returns Une recette externe harmonisée.
   */
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