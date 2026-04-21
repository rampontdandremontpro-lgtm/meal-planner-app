package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.repository.RecipesRepository

class RecipeActionsViewModelFactory(
    private val recipesRepository: RecipesRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RecipeActionsViewModel::class.java)) {
            return RecipeActionsViewModel(recipesRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
