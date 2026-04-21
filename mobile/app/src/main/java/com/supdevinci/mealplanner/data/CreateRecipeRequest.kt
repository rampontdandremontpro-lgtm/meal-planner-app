package com.supdevinci.mealplanner.data

data class CreateRecipeRequest(
    val title: String,
    val category: String,
    val imageUrl: String,
    val prepTime: String,
    val servings: Int,
    val instructions: String,
    val ingredients: List<Ingredient>
)
