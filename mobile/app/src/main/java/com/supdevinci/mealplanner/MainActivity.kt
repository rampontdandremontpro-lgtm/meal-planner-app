package com.supdevinci.mealplanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.data.TokenManager
import com.supdevinci.mealplanner.repository.AuthRepository
import com.supdevinci.mealplanner.ui.screens.LoginScreen
import com.supdevinci.mealplanner.ui.theme.MealPlannerTheme
import com.supdevinci.mealplanner.viewmodel.LoginViewModel
import com.supdevinci.mealplanner.viewmodel.LoginViewModelFactory

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val authRepository = AuthRepository()
        val tokenManager = TokenManager(applicationContext)

        val factory = LoginViewModelFactory(authRepository, tokenManager)
        val loginViewModel = ViewModelProvider(this, factory)[LoginViewModel::class.java]

        setContent {
            MealPlannerTheme {
                LoginScreen(
                    viewModel = loginViewModel,
                    onLoginSuccess = {
                        // Pour l’instant on ne navigue pas encore.
                        // Plus tard tu pourras envoyer vers RecipesScreen.
                    }
                )
            }
        }
    }
}
