package com.supdevinci.mealplanner.api

import com.supdevinci.mealplanner.data.CreateMealPlanRequest
import com.supdevinci.mealplanner.data.MealPlanItem
import com.supdevinci.mealplanner.data.MealPlanWeekResponse
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface PlannerApi {

    @GET("meal-plans/week")
    suspend fun getWeekMealPlans(
        @Query("date") date: String
    ): MealPlanWeekResponse

    @POST("meal-plans")
    suspend fun createMealPlan(
        @Body request: CreateMealPlanRequest
    ): MealPlanItem

    @DELETE("meal-plans/{id}")
    suspend fun deleteMealPlan(
        @Path("id") id: Int
    )
}
