package com.supdevinci.mealplanner.repository

import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.LoginRequest
import com.supdevinci.mealplanner.data.LoginResponse
import com.supdevinci.mealplanner.data.RegisterRequest

class AuthRepository {

    private val api = RetrofitClient.authApi

    suspend fun login(email: String, password: String): LoginResponse {
        return api.login(LoginRequest(email, password))
    }

    suspend fun register(
        firstname: String,
        lastname: String,
        email: String,
        password: String
    ) {
        api.register(RegisterRequest(firstname, lastname, email, password))
    }
}
