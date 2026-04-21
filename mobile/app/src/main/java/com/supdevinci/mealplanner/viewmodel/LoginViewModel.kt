package com.supdevinci.mealplanner.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.supdevinci.mealplanner.data.TokenManager
import com.supdevinci.mealplanner.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val errorMessage: String? = null,
    val userFirstName: String? = null,
    val userLastName: String? = null
)

class LoginViewModel(
    private val authRepository: AuthRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState

    fun onEmailChange(value: String) {
        _uiState.value = _uiState.value.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        _uiState.value = _uiState.value.copy(password = value)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }

    fun resetState() {
        _uiState.value = LoginUiState()
    }

    fun login() {
        val email = _uiState.value.email.trim()
        val password = _uiState.value.password.trim()

        if (email.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorMessage = "Veuillez remplir tous les champs."
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null,
                isSuccess = false
            )

            try {
                val response = authRepository.login(email, password)

                Log.d("LOGIN_DEBUG", "access_token = ${response.access_token}")
                Log.d("LOGIN_DEBUG", "token = ${response.token}")
                Log.d("LOGIN_DEBUG", "user name = ${response.user?.name}")
                Log.d("LOGIN_DEBUG", "user email = ${response.user?.email}")

                val token = response.access_token ?: response.token

                if (!token.isNullOrBlank()) {
                    tokenManager.saveToken(token)

                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isSuccess = true,
                        errorMessage = null,
                        userFirstName = response.user?.name,
                        userLastName = null
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = "Token introuvable dans la réponse."
                    )
                }
            } catch (e: HttpException) {
                val backendMessage = try {
                    val errorBody = e.response()?.errorBody()?.string()
                    if (!errorBody.isNullOrBlank()) {
                        val json = JSONObject(errorBody)
                        when {
                            json.has("message") && json.get("message") is String ->
                                json.getString("message")

                            json.has("message") && json.get("message") is org.json.JSONArray -> {
                                val arr = json.getJSONArray("message")
                                if (arr.length() > 0) arr.getString(0) else "Erreur de connexion."
                            }

                            else -> "Erreur de connexion."
                        }
                    } else {
                        "Erreur de connexion."
                    }
                } catch (_: Exception) {
                    "Erreur de connexion."
                }

                Log.e("LOGIN_DEBUG", "HttpException: ${e.code()} - $backendMessage", e)

                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = backendMessage
                )
            } catch (e: Exception) {
                Log.e("LOGIN_DEBUG", "Generic exception during login", e)

                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erreur de connexion au serveur."
                )
            }
        }
    }
}
