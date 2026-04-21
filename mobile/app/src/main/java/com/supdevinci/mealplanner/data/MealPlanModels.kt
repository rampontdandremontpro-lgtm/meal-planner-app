package com.supdevinci.mealplanner.data

data class CreateMealPlanRequest(
    val date: String,
    val mealType: String,
    val source: String,
    val recipeId: Int? = null,
    val externalRecipeId: String? = null
)

data class MealPlanWeekResponse(
    val weekStart: String,
    val weekEnd: String,
    val items: List<MealPlanItem>
)

data class MealPlanItem(
    val id: Int,
    val date: String,
    val mealType: String,
    val source: String,
    val recipe: Recipe
)
