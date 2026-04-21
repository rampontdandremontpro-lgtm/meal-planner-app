package com.supdevinci.mealplanner.data

import com.google.gson.annotations.SerializedName

data class Recipe(
    @SerializedName(value = "id", alternate = ["idMeal"])
    val id: String = "",

    @SerializedName(value = "title", alternate = ["strMeal"])
    val title: String = "",

    @SerializedName(value = "category", alternate = ["strCategory"])
    val category: String = "",

    @SerializedName(value = "imageUrl", alternate = ["image", "strMealThumb"])
    val imageUrl: String = "",

    @SerializedName(value = "instructions", alternate = ["strInstructions"])
    val instructions: String = "",

    val prepTime: String = "",
    val servings: Int? = null,
    val source: String = "external",
    val ingredients: List<Ingredient> = emptyList()
)
