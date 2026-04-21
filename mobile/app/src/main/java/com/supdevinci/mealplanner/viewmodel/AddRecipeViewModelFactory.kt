package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.repository.RecipesRepository

class AddRecipeViewModelFactory(
    private val recipesRepository: RecipesRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AddRecipeViewModel::class.java)) {
            return AddRecipeViewModel(recipesRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
