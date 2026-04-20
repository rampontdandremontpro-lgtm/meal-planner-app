package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.LoginRequest
import com.supdevinci.mealplanner.data.LoginResponse
import com.supdevinci.mealplanner.data.RegisterRequest

class AuthRepository {

    suspend fun login(email: String, password: String): LoginResponse {
        return RetrofitClient.authApi.login(
            LoginRequest(email = email, password = password)
        )
    }

    suspend fun register(
        firstName: String,
        lastName: String,
        email: String,
        password: String
    ): LoginResponse {
        return RetrofitClient.authApi.register(
            RegisterRequest(
                firstName = firstName,
                lastName = lastName,
                email = email,
                password = password
            )
        )
    }
}
