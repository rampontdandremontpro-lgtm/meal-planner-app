package com.supdevinci.mealplanner.api

import com.supdevinci.mealplanner.data.AutoShoppingItemRequest
import com.supdevinci.mealplanner.data.CreateShoppingItemRequest
import com.supdevinci.mealplanner.data.ShoppingItemResponse
import com.supdevinci.mealplanner.data.ShoppingListWeekResponse
import com.supdevinci.mealplanner.data.UpdateShoppingItemRequest
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ShoppingListApi {

    @GET("shopping-list/week")
    suspend fun getShoppingList(
        @Query("date") date: String
    ): ShoppingListWeekResponse

    @POST("shopping-list/items")
    suspend fun addShoppingItem(
        @Body request: CreateShoppingItemRequest
    ): ShoppingItemResponse

    @PATCH("shopping-list/items/{id}")
    suspend fun updateShoppingItem(
        @Path("id") id: Int,
        @Body request: UpdateShoppingItemRequest
    ): ShoppingItemResponse

    @DELETE("shopping-list/items/{id}")
    suspend fun deleteShoppingItem(
        @Path("id") id: Int
    )

    @PATCH("shopping-list/auto")
    suspend fun updateAutoShoppingItem(
        @Body request: AutoShoppingItemRequest
    )

    @PATCH("shopping-list/auto/hide")
    suspend fun hideAutoShoppingItem(
        @Body request: AutoShoppingItemRequest
    )
}
