package com.supdevinci.mealplanner.data

data class ShoppingListWeekResponse(
    val weekStart: String? = null,
    val weekEnd: String? = null,
    val items: List<ShoppingItemResponse> = emptyList()
)

data class ShoppingItemResponse(
    val id: String? = null,
    val name: String? = null,
    val ingredientName: String? = null,
    val quantity: String? = null,
    val unit: String? = null,
    val checked: Boolean? = null,
    val isManual: Boolean? = null,
    val source: String? = null,
    val recipeId: Int? = null,
    val externalRecipeId: String? = null,
    val weekStart: String? = null
)

data class ShoppingListItemUi(
    val id: String,
    val backendId: Int? = null,
    val name: String,
    val ingredientName: String,
    val quantity: String = "",
    val unit: String = "",
    val checked: Boolean = false,
    val isManual: Boolean = false,
    val source: String = "automatic",
    val recipeId: Int? = null,
    val externalRecipeId: String? = null,
    val weekStart: String
)

data class CreateShoppingItemRequest(
    val name: String,
    val quantity: String = "",
    val unit: String = "",
    val date: String
)

data class UpdateShoppingItemRequest(
    val checked: Boolean
)

data class AutoShoppingItemRequest(
    val date: String,
    val recipeId: Int? = null,
    val externalRecipeId: String? = null,
    val ingredientName: String,
    val quantity: String = "",
    val unit: String = "",
    val checked: Boolean? = null,
    val hidden: Boolean? = null
)
