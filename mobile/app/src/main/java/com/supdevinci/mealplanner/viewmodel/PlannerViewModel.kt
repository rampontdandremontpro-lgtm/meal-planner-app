package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.CreateMealPlanRequest
import com.supdevinci.mealplanner.data.MealPlanItem
import com.supdevinci.mealplanner.repository.PlannerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.DayOfWeek
import java.time.LocalDate

data class PlannerUiState(
    val weekStart: LocalDate = LocalDate.now().with(DayOfWeek.MONDAY),
    val items: List<MealPlanItem> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class PlannerViewModel(
    private val plannerRepository: PlannerRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PlannerUiState())
    val uiState: StateFlow<PlannerUiState> = _uiState

    fun loadWeek(date: LocalDate = _uiState.value.weekStart) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null,
                weekStart = date
            )

            try {
                val items = plannerRepository.getWeekMealPlans(date.toString())
                _uiState.value = _uiState.value.copy(
                    items = items,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Impossible de charger le planning."
                )
            }
        }
    }

    fun goPreviousWeek() {
        loadWeek(_uiState.value.weekStart.minusWeeks(1))
    }

    fun goNextWeek() {
        loadWeek(_uiState.value.weekStart.plusWeeks(1))
    }

    fun addMealPlan(
        date: String,
        mealType: String,
        recipeId: String,
        source: String,
        onSuccess: () -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val request = CreateMealPlanRequest(
                    date = date,
                    mealType = mealType,
                    source = source,
                    recipeId = if (source == "local") recipeId.toIntOrNull() else null,
                    externalRecipeId = if (source == "external") recipeId else null
                )
                plannerRepository.createMealPlan(request)
                loadWeek(_uiState.value.weekStart)
                onSuccess()
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Impossible d’ajouter au planning."
                )
            }
        }
    }

    fun removeMealPlan(id: Int) {
        viewModelScope.launch {
            try {
                plannerRepository.deleteMealPlan(id)
                loadWeek(_uiState.value.weekStart)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Impossible de retirer cette recette."
                )
            }
        }
    }
}
