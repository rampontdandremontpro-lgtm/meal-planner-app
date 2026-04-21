package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.CreateRecipeRequest
import com.supdevinci.mealplanner.data.Ingredient
import com.supdevinci.mealplanner.repository.RecipesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class EditRecipeUiState(
    val id: String = "",
    val title: String = "",
    val category: String = "",
    val imageUrl: String = "",
    val prepTime: String = "",
    val servings: String = "",
    val instructions: String = "",
    val ingredients: List<Ingredient> = listOf(Ingredient()),
    val isLoading: Boolean = false,
    val isSaving: Boolean = false,
    val isDeleted: Boolean = false,
    val isSaved: Boolean = false,
    val errorMessage: String? = null
)

class EditRecipeViewModel(
    private val recipesRepository: RecipesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(EditRecipeUiState())
    val uiState: StateFlow<EditRecipeUiState> = _uiState

    fun loadRecipe(id: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)

            try {
                val recipe = recipesRepository.getRecipeById("local", id)
                _uiState.value = EditRecipeUiState(
                    id = recipe.id,
                    title = recipe.title,
                    category = recipe.category,
                    imageUrl = recipe.imageUrl,
                    prepTime = recipe.prepTime,
                    servings = recipe.servings?.toString() ?: "2",
                    instructions = recipe.instructions,
                    ingredients = if (recipe.ingredients.isEmpty()) listOf(Ingredient()) else recipe.ingredients,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Impossible de charger la recette."
                )
            }
        }
    }

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

    fun saveRecipe() {
        val state = _uiState.value

        viewModelScope.launch {
            _uiState.value = state.copy(isSaving = true, errorMessage = null)

            try {
                val request = CreateRecipeRequest(
                    title = state.title,
                    category = state.category,
                    imageUrl = state.imageUrl,
                    prepTime = state.prepTime,
                    servings = state.servings.toIntOrNull() ?: 2,
                    instructions = state.instructions,
                    ingredients = state.ingredients.filter { it.name.isNotBlank() }
                )

                recipesRepository.updateRecipe(state.id, request)

                _uiState.value = state.copy(
                    isSaving = false,
                    isSaved = true
                )
            } catch (e: Exception) {
                _uiState.value = state.copy(
                    isSaving = false,
                    errorMessage = "Impossible d’enregistrer les modifications."
                )
            }
        }
    }

    fun deleteRecipe() {
        val state = _uiState.value

        viewModelScope.launch {
            try {
                recipesRepository.deleteRecipe(state.id)
                _uiState.value = state.copy(isDeleted = true)
            } catch (e: Exception) {
                _uiState.value = state.copy(
                    errorMessage = "Impossible de supprimer la recette."
                )
            }
        }
    }
}
