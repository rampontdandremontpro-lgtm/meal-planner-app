package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.CreateMealPlanRequest
import com.supdevinci.mealplanner.data.MealPlanItem

class PlannerRepository {

    suspend fun getWeekMealPlans(date: String): List<MealPlanItem> {
        return RetrofitClient.plannerApi.getWeekMealPlans(date).items
    }

    suspend fun createMealPlan(request: CreateMealPlanRequest): MealPlanItem {
        return RetrofitClient.plannerApi.createMealPlan(request)
    }

    suspend fun deleteMealPlan(id: Int) {
        RetrofitClient.plannerApi.deleteMealPlan(id)
    }
}
