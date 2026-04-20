package com.supdevinci.mealplanner.data

data class LoginResponse(
    val access_token: String? = null,
    val token: String? = null,
    val user: User? = null
)
