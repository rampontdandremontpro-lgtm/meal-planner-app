package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.repository.PlannerRepository

class PlannerViewModelFactory(
    private val plannerRepository: PlannerRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PlannerViewModel::class.java)) {
            return PlannerViewModel(plannerRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
