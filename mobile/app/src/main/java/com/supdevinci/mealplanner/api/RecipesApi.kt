package com.supdevinci.mealplanner.api

import com.supdevinci.mealplanner.data.CreateRecipeRequest
import com.supdevinci.mealplanner.data.Recipe
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface RecipesApi {

    @GET("recipes")
    suspend fun getRecipes(
        @Query("search") search: String? = null,
        @Query("category") category: String? = null
    ): List<Recipe>

    @GET("recipes/{source}/{id}")
    suspend fun getRecipeById(
        @Path("source") source: String,
        @Path("id") id: String
    ): Recipe

    @POST("recipes")
    suspend fun createRecipe(
        @Body request: CreateRecipeRequest
    ): Recipe
}
