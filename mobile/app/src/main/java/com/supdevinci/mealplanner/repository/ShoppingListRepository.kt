package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.AutoShoppingItemRequest
import com.supdevinci.mealplanner.data.CreateShoppingItemRequest
import com.supdevinci.mealplanner.data.ShoppingListItemUi
import com.supdevinci.mealplanner.data.UpdateShoppingItemRequest

class ShoppingListRepository {

    suspend fun getShoppingList(date: String): List<ShoppingListItemUi> {
        val response = RetrofitClient.shoppingListApi.getShoppingList(date)
        val weekStart = response.weekStart ?: date

        return response.items.mapIndexed { index, item ->
            val source = item.source ?: if (item.isManual == true) "manual" else "automatic"
            val ingredientName = item.ingredientName ?: item.name ?: "Ingrédient"

            val backendId = if (source == "automatic") {
                null
            } else {
                item.id?.toIntOrNull()
            }

            ShoppingListItemUi(
                id = item.id
                    ?: "auto-${item.recipeId ?: item.externalRecipeId ?: "unknown"}-$ingredientName-$index",
                backendId = backendId,
                name = item.name ?: ingredientName,
                ingredientName = ingredientName,
                quantity = item.quantity ?: "",
                unit = item.unit ?: "",
                checked = item.checked ?: false,
                isManual = item.isManual ?: source != "automatic",
                source = source,
                recipeId = item.recipeId,
                externalRecipeId = item.externalRecipeId,
                weekStart = item.weekStart ?: weekStart
            )
        }
    }

    suspend fun addManualItem(name: String, date: String) {
        RetrofitClient.shoppingListApi.addShoppingItem(
            CreateShoppingItemRequest(
                name = name,
                date = date
            )
        )
    }

    suspend fun updateManualItem(id: Int, checked: Boolean) {
        RetrofitClient.shoppingListApi.updateShoppingItem(
            id = id,
            request = UpdateShoppingItemRequest(checked = checked)
        )
    }

    suspend fun deleteManualItem(id: Int) {
        RetrofitClient.shoppingListApi.deleteShoppingItem(id)
    }

    suspend fun updateAutoItem(item: ShoppingListItemUi, checked: Boolean) {
        RetrofitClient.shoppingListApi.updateAutoShoppingItem(
            AutoShoppingItemRequest(
                date = item.weekStart,
                recipeId = item.recipeId,
                externalRecipeId = item.externalRecipeId,
                ingredientName = item.ingredientName,
                quantity = item.quantity,
                unit = item.unit,
                checked = checked
            )
        )
    }

    suspend fun hideAutoItem(item: ShoppingListItemUi) {
        RetrofitClient.shoppingListApi.hideAutoShoppingItem(
            AutoShoppingItemRequest(
                date = item.weekStart,
                recipeId = item.recipeId,
                externalRecipeId = item.externalRecipeId,
                ingredientName = item.ingredientName,
                quantity = item.quantity,
                unit = item.unit,
                hidden = true
            )
        )
    }
}
