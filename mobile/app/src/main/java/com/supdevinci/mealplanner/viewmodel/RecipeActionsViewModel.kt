package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.repository.RecipesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class RecipeActionsUiState(
    val isDeleting: Boolean = false,
    val isDeleted: Boolean = false,
    val errorMessage: String? = null
)

class RecipeActionsViewModel(
    private val recipesRepository: RecipesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(RecipeActionsUiState())
    val uiState: StateFlow<RecipeActionsUiState> = _uiState

    fun resetState() {
        _uiState.value = RecipeActionsUiState()
    }

    fun deleteRecipe(id: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isDeleting = true,
                errorMessage = null
            )

            try {
                recipesRepository.deleteRecipe(id)
                _uiState.value = _uiState.value.copy(
                    isDeleting = false,
                    isDeleted = true
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isDeleting = false,
                    errorMessage = "Impossible de supprimer la recette."
                )
            }
        }
    }
}
