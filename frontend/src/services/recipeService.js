/**
 * @file recipeService.js
 * @description Fonctions de service dédiées aux recettes.
 * Normalise les objets reçus depuis plusieurs sources puis expose des helpers
 * pour lister, lire, créer, modifier et supprimer des recettes.
 */

import api from "./api";

/**
 * Extrait les ingrédients d'une recette en gérant plusieurs formats source.
 *
 * @param {Object} recipe Objet recette brut.
 * @returns {{name: string, quantity: string}[]} Liste normalisée des ingrédients.
 */
function extractIngredients(recipe) {
  if (Array.isArray(recipe.ingredients)) {
    return recipe.ingredients;
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i += 1) {
    const name = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();

    if (name) {
      ingredients.push({
        name,
        quantity: measure || "",
      });
    }
  }

  return ingredients;
}

/**
 * Normalise une recette provenant du backend local ou d'une API externe.
 *
 * @param {Object} recipe Objet recette brut.
 * @returns {Object} Objet recette uniforme pour le frontend.
 */
function normalizeRecipe(recipe) {
  return {
    id: String(recipe.id || recipe.idMeal || ""),
    title: recipe.title || recipe.strMeal || "Recette",
    category: recipe.category || recipe.strCategory || "Autre",
    imageUrl:
      recipe.imageUrl ||
      recipe.image ||
      recipe.strMealThumb ||
      "https://via.placeholder.com/400x300?text=Meal+Planner",
    prepTime: recipe.prepTime || recipe.preparationTime || "",
    servings: recipe.servings || 2,
    instructions: recipe.instructions || recipe.strInstructions || "",
    ingredients: extractIngredients(recipe),
    source: recipe.source || "external",
    userId: recipe.userId || recipe.user?.id || null,
  };
}

/**
 * Récupère la liste des recettes.
 *
 * @param {Object} [params={}] Paramètres de requête optionnels.
 * @returns {Promise<Object[]>} Liste de recettes normalisées.
 */
export async function getRecipes(params = {}) {
  const response = await api.get("/recipes", { params });

  const rawData = Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.recipes || [];

  return rawData.map(normalizeRecipe);
}

/**
 * Récupère une recette à partir de sa source et de son identifiant.
 *
 * @param {string} source Source de la recette, par exemple `local` ou `external`.
 * @param {string|number} id Identifiant de la recette.
 * @returns {Promise<Object>} Recette normalisée.
 */
export async function getRecipeById(source, id) {
  const response = await api.get(`/recipes/${source}/${id}`);
  return normalizeRecipe(response.data?.data || response.data);
}

/**
 * Crée une recette locale.
 *
 * @param {Object} payload Données de création.
 * @returns {Promise<any>} Réponse du backend.
 */
export async function createRecipe(payload) {
  const response = await api.post("/recipes", payload);
  return response.data;
}

/**
 * Met à jour une recette locale.
 *
 * @param {string|number} id Identifiant de la recette.
 * @param {Object} payload Données de mise à jour.
 * @returns {Promise<any>} Réponse du backend.
 */
export async function updateRecipe(id, payload) {
  const response = await api.put(`/recipes/${id}`, payload);
  return response.data;
}

/**
 * Supprime une recette locale.
 *
 * @param {string|number} id Identifiant de la recette.
 * @returns {Promise<any>} Réponse du backend.
 */
export async function deleteRecipe(id) {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
}