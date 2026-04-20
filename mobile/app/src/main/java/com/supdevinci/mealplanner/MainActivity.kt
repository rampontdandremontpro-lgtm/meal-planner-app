package com.supdevinci.mealplanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModelProvider
import com.supdevinci.mealplanner.data.TokenManager
import com.supdevinci.mealplanner.repository.AuthRepository
import com.supdevinci.mealplanner.ui.screens.HomeScreen
import com.supdevinci.mealplanner.ui.screens.LoginScreen
import com.supdevinci.mealplanner.ui.screens.RegisterScreen
import com.supdevinci.mealplanner.ui.screens.SplashScreen
import com.supdevinci.mealplanner.ui.theme.MealPlannerTheme
import com.supdevinci.mealplanner.viewmodel.LoginViewModel
import com.supdevinci.mealplanner.viewmodel.LoginViewModelFactory
import com.supdevinci.mealplanner.viewmodel.RegisterViewModel
import com.supdevinci.mealplanner.viewmodel.RegisterViewModelFactory

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val authRepository = AuthRepository()
        val tokenManager = TokenManager(applicationContext)

        val loginFactory = LoginViewModelFactory(authRepository, tokenManager)
        val loginViewModel = ViewModelProvider(this, loginFactory)[LoginViewModel::class.java]

        val registerFactory = RegisterViewModelFactory(authRepository)
        val registerViewModel = ViewModelProvider(this, registerFactory)[RegisterViewModel::class.java]

        setContent {
            MealPlannerTheme {
                var currentScreen by remember { mutableStateOf("splash") }

                when (currentScreen) {
                    "splash" -> SplashScreen(
                        onFinish = {
                            currentScreen = "login"
                        }
                    )

                    "login" -> LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            currentScreen = "home"
                        },
                        onGoToRegister = {
                            currentScreen = "register"
                        }
                    )

                    "register" -> RegisterScreen(
                        viewModel = registerViewModel,
                        onBackToLogin = {
                            currentScreen = "login"
                        }
                    )

                    "home" -> HomeScreen(
                        onLogout = {
                            currentScreen = "login"
                        }
                    )
                }
            }
        }
    }
}
