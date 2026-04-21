package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.CreateRecipeRequest
import com.supdevinci.mealplanner.data.Ingredient
import com.supdevinci.mealplanner.repository.RecipesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class AddRecipeUiState(
    val title: String = "",
    val category: String = "",
    val imageUrl: String = "",
    val prepTime: String = "",
    val servings: String = "",
    val instructions: String = "",
    val ingredients: List<Ingredient> = listOf(Ingredient()),
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val errorMessage: String? = null
)

class AddRecipeViewModel(
    private val recipesRepository: RecipesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AddRecipeUiState())
    val uiState: StateFlow<AddRecipeUiState> = _uiState

    fun onTitleChange(value: String) { _uiState.value = _uiState.value.copy(title = value) }
    fun onCategoryChange(value: String) { _uiState.value = _uiState.value.copy(category = value) }
    fun onImageUrlChange(value: String) { _uiState.value = _uiState.value.copy(imageUrl = value) }
    fun onPrepTimeChange(value: String) { _uiState.value = _uiState.value.copy(prepTime = value) }
    fun onServingsChange(value: String) { _uiState.value = _uiState.value.copy(servings = value) }
    fun onInstructionsChange(value: String) { _uiState.value = _uiState.value.copy(instructions = value) }

    fun updateIngredient(index: Int, name: String? = null, quantity: String? = null) {
        val updated = _uiState.value.ingredients.toMutableList()
        val current = updated[index]
        updated[index] = current.copy(
            name = name ?: current.name,
            quantity = quantity ?: current.quantity
        )
        _uiState.value = _uiState.value.copy(ingredients = updated)
    }

    fun addIngredient() {
        _uiState.value = _uiState.value.copy(
            ingredients = _uiState.value.ingredients + Ingredient()
        )
    }

    fun removeIngredient(index: Int) {
        val current = _uiState.value.ingredients
        if (current.size == 1) return
        _uiState.value = _uiState.value.copy(
            ingredients = current.filterIndexed { i, _ -> i != index }
        )
    }

    fun submit() {
        val state = _uiState.value

        if (state.title.isBlank() || state.category.isBlank() || state.instructions.isBlank()) {
            _uiState.value = state.copy(errorMessage = "Remplis les champs obligatoires.")
            return
        }

        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true, errorMessage = null)

            try {
                val request = CreateRecipeRequest(
                    title = state.title,
                    category = state.category,
                    imageUrl = state.imageUrl,
                    prepTime = if (state.prepTime.isBlank()) "10 min" else state.prepTime,
                    servings = state.servings.toIntOrNull() ?: 2,
                    instructions = state.instructions,
                    ingredients = state.ingredients.filter { it.name.isNotBlank() }
                )

                recipesRepository.createRecipe(request)

                _uiState.value = state.copy(
                    isLoading = false,
                    isSuccess = true
                )
            } catch (e: Exception) {
                _uiState.value = state.copy(
                    isLoading = false,
                    errorMessage = "Impossible de créer la recette."
                )
            }
        }
    }
}
