package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.LoginRequest
import com.supdevinci.mealplanner.data.LoginResponse

class AuthRepository {
    suspend fun login(email: String, password: String): LoginResponse {
        return RetrofitClient.authApi.login(
            LoginRequest(email = email, password = password)
        )
    }
}
