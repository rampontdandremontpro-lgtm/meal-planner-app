package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.CreateRecipeRequest
import com.supdevinci.mealplanner.data.Recipe

class RecipesRepository {

    suspend fun getRecipes(search: String? = null): List<Recipe> {
        return RetrofitClient.recipesApi.getRecipes(search = search)
    }

    suspend fun getRecipeById(source: String, id: String): Recipe {
        return RetrofitClient.recipesApi.getRecipeById(source, id)
    }

    suspend fun createRecipe(request: CreateRecipeRequest): Recipe {
        return RetrofitClient.recipesApi.createRecipe(request)
    }
}
