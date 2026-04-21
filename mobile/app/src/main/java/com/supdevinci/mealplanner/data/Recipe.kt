package com.supdevinci.mealplanner.data

data class Recipe(
    val id: String = "",
    val title: String = "",
    val category: String = "",
    val imageUrl: String = "",
    val instructions: String = "",
    val prepTime: String = "",
    val servings: Int? = null,
    val source: String = "external",
    val ingredients: List<Ingredient> = emptyList()
)
