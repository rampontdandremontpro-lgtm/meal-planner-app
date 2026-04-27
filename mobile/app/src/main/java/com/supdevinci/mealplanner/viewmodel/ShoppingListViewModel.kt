package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.ShoppingListItemUi
import com.supdevinci.mealplanner.repository.ShoppingListRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate

data class ShoppingListUiState(
    val selectedDate: String = LocalDate.now().toString(),
    val items: List<ShoppingListItemUi> = emptyList(),
    val manualInput: String = "",
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val message: String? = null,
    val errorMessage: String? = null
)

class ShoppingListViewModel(
    private val repository: ShoppingListRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ShoppingListUiState())
    val uiState: StateFlow<ShoppingListUiState> = _uiState

    fun loadShoppingList() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null
            )

            try {
                val items = repository.getShoppingList(_uiState.value.selectedDate)

                _uiState.value = _uiState.value.copy(
                    items = items,
                    isLoading = false,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    items = emptyList(),
                    isLoading = false,
                    errorMessage = e.message ?: "Impossible de charger la liste de courses."
                )
            }
        }
    }

    fun onManualInputChange(value: String) {
        _uiState.value = _uiState.value.copy(
            manualInput = value,
            message = null,
            errorMessage = null
        )
    }

    fun addManualItem() {
        val name = _uiState.value.manualInput.trim()

        if (name.isEmpty()) {
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isSubmitting = true,
                message = null,
                errorMessage = null
            )

            try {
                repository.addManualItem(
                    name = name,
                    date = _uiState.value.selectedDate
                )

                _uiState.value = _uiState.value.copy(
                    manualInput = "",
                    isSubmitting = false,
                    message = "Ingrédient ajouté à la liste."
                )

                loadShoppingList()
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isSubmitting = false,
                    errorMessage = e.message ?: "Impossible d’ajouter cet ingrédient."
                )
            }
        }
    }

    fun toggleItem(item: ShoppingListItemUi, checked: Boolean) {
        val previousItems = _uiState.value.items

        _uiState.value = _uiState.value.copy(
            items = previousItems.map {
                if (it.id == item.id) it.copy(checked = checked) else it
            },
            message = null,
            errorMessage = null
        )

        viewModelScope.launch {
            try {
                if (item.source == "automatic") {
                    repository.updateAutoItem(item, checked)
                } else {
                    val backendId = item.backendId
                        ?: throw IllegalStateException("Identifiant manuel manquant.")

                    repository.updateManualItem(backendId, checked)
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    items = previousItems,
                    errorMessage = e.message ?: "Impossible de mettre à jour cet ingrédient."
                )
            }
        }
    }

    fun deleteItem(item: ShoppingListItemUi) {
        val previousItems = _uiState.value.items

        _uiState.value = _uiState.value.copy(
            items = previousItems.filter { it.id != item.id },
            message = null,
            errorMessage = null
        )

        viewModelScope.launch {
            try {
                if (item.source == "automatic") {
                    repository.hideAutoItem(item)
                } else {
                    val backendId = item.backendId
                        ?: throw IllegalStateException("Identifiant manuel manquant.")

                    repository.deleteManualItem(backendId)
                }

                _uiState.value = _uiState.value.copy(
                    message = "Ingrédient supprimé de la liste."
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    items = previousItems,
                    errorMessage = e.message ?: "Impossible de supprimer cet ingrédient."
                )
            }
        }
    }
}
