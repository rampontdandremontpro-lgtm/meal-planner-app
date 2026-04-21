package com.supdevinci.mealplanner.data

data class LoginResponse(
    val access_token: String? = null,
    val token: String? = null,
    val user: LoginUser? = null
)

data class LoginUser(
    val id: Int? = null,
    val name: String? = null,
    val email: String? = null
)
