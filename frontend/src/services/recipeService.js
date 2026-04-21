import api from "./api";

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

function normalizeRecipe(recipe) {
  return {
    id: recipe.id || recipe.idMeal,
    title: recipe.title || recipe.strMeal || "Recette",
    category: recipe.category || recipe.strCategory || "Autre",
    image:
      recipe.image ||
      recipe.imageUrl ||
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

export async function getRecipes(params = {}) {
  const response = await api.get("/recipes", { params });

  const rawData = Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.recipes || [];

  return rawData.map(normalizeRecipe);
}

export async function getRecipeById(source, id) {
  const response = await api.get(`/recipes/${source}/${id}`);
  return normalizeRecipe(response.data?.data || response.data);
}

export async function createRecipe(payload) {
  const response = await api.post("/recipes", payload);
  return response.data;
}

export async function updateRecipe(id, payload) {
  const response = await api.put(`/recipes/${id}`, payload);
  return response.data;
}

export async function deleteRecipe(id) {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
}