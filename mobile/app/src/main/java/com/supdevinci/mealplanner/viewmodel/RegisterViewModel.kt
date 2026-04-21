package com.supdevinci.mealplanner.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException
import org.json.JSONObject

data class RegisterUiState(
    val firstname: String = "",
    val lastname: String = "",
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null
)

class RegisterViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState

    fun onFirstnameChange(value: String) {
        _uiState.value = _uiState.value.copy(firstname = value)
    }

    fun onLastnameChange(value: String) {
        _uiState.value = _uiState.value.copy(lastname = value)
    }

    fun onEmailChange(value: String) {
        _uiState.value = _uiState.value.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        _uiState.value = _uiState.value.copy(password = value)
    }

    fun register() {
        val firstname = _uiState.value.firstname.trim()
        val lastname = _uiState.value.lastname.trim()
        val email = _uiState.value.email.trim()
        val password = _uiState.value.password.trim()

        if (firstname.isBlank() || lastname.isBlank() || email.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorMessage = "Veuillez remplir tous les champs."
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null,
                successMessage = null
            )

            try {
                authRepository.register(firstname, lastname, email, password)

                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isSuccess = true,
                    successMessage = "Compte créé avec succès. Redirection..."
                )
            } catch (e: HttpException) {
                val backendMessage = try {
                    val errorBody = e.response()?.errorBody()?.string()
                    if (!errorBody.isNullOrBlank()) {
                        val json = JSONObject(errorBody)
                        when {
                            json.has("message") && json.get("message") is String -> json.getString("message")
                            json.has("message") && json.get("message") is org.json.JSONArray -> {
                                val arr = json.getJSONArray("message")
                                if (arr.length() > 0) arr.getString(0) else "Erreur lors de l'inscription."
                            }
                            else -> "Erreur lors de l'inscription."
                        }
                    } else {
                        "Erreur lors de l'inscription."
                    }
                } catch (_: Exception) {
                    "Erreur lors de l'inscription."
                }

                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = backendMessage
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Erreur lors de l'inscription."
                )
            }
        }
    }
}
