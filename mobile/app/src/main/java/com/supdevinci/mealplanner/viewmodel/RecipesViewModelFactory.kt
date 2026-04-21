package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.repository.RecipesRepository

class RecipesViewModelFactory(
    private val recipesRepository: RecipesRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RecipesViewModel::class.java)) {
            return RecipesViewModel(recipesRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
