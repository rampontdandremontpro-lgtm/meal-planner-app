package com.supdevinci.mealplanner.api

import com.supdevinci.mealplanner.data.LoginRequest
import com.supdevinci.mealplanner.data.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}
