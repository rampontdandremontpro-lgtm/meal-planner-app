package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.Recipe
import com.supdevinci.mealplanner.repository.RecipesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class RecipesUiState(
    val allRecipes: List<Recipe> = emptyList(),
    val filteredRecipes: List<Recipe> = emptyList(),
    val categories: List<String> = listOf("Toutes"),
    val selectedCategory: String = "Toutes",
    val search: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class RecipesViewModel(
    private val recipesRepository: RecipesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(RecipesUiState())
    val uiState: StateFlow<RecipesUiState> = _uiState

    fun loadRecipes() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null
            )

            try {
                val recipes = recipesRepository.getRecipes()

                val categories = listOf("Toutes") + recipes
                    .map { it.category.trim() }
                    .filter { it.isNotBlank() }
                    .distinct()

                _uiState.value = _uiState.value.copy(
                    allRecipes = recipes,
                    categories = categories,
                    isLoading = false
                )

                applyFilters()
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Impossible de charger les recettes."
                )
            }
        }
    }

    fun onSearchChange(value: String) {
        _uiState.value = _uiState.value.copy(search = value)
        applyFilters()
    }

    fun onCategorySelected(category: String) {
        _uiState.value = _uiState.value.copy(selectedCategory = category)
        applyFilters()
    }

    private fun applyFilters() {
        val state = _uiState.value

        val filtered = state.allRecipes.filter { recipe ->
            val matchesSearch = state.search.isBlank() ||
                recipe.title.contains(state.search, ignoreCase = true)

            val matchesCategory = state.selectedCategory == "Toutes" ||
                recipe.category.equals(state.selectedCategory, ignoreCase = true)

            matchesSearch && matchesCategory
        }

        _uiState.value = state.copy(filteredRecipes = filtered)
    }
}
