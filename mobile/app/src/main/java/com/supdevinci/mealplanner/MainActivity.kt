package com.supdevinci.mealplanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.TokenManager
import com.supdevinci.mealplanner.repository.AuthRepository
import com.supdevinci.mealplanner.repository.RecipesRepository
import com.supdevinci.mealplanner.ui.screens.AddRecipeScreen
import com.supdevinci.mealplanner.ui.screens.LoginScreen
import com.supdevinci.mealplanner.ui.screens.RecipeDetailScreen
import com.supdevinci.mealplanner.ui.screens.RecipesScreen
import com.supdevinci.mealplanner.ui.screens.RegisterScreen
import com.supdevinci.mealplanner.ui.screens.SplashScreen
import com.supdevinci.mealplanner.ui.theme.MealPlannerTheme
import com.supdevinci.mealplanner.viewmodel.AddRecipeViewModel
import com.supdevinci.mealplanner.viewmodel.AddRecipeViewModelFactory
import com.supdevinci.mealplanner.viewmodel.LoginViewModel
import com.supdevinci.mealplanner.viewmodel.LoginViewModelFactory
import com.supdevinci.mealplanner.viewmodel.RecipeDetailViewModel
import com.supdevinci.mealplanner.viewmodel.RecipeDetailViewModelFactory
import com.supdevinci.mealplanner.viewmodel.RecipesViewModel
import com.supdevinci.mealplanner.viewmodel.RecipesViewModelFactory
import com.supdevinci.mealplanner.viewmodel.RegisterViewModel
import com.supdevinci.mealplanner.viewmodel.RegisterViewModelFactory
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        RetrofitClient.init(applicationContext)

        val authRepository = AuthRepository()
        val recipesRepository = RecipesRepository()
        val tokenManager = TokenManager(applicationContext)

        val loginViewModel = ViewModelProvider(
            this,
            LoginViewModelFactory(authRepository, tokenManager)
        )[LoginViewModel::class.java]

        val registerViewModel = ViewModelProvider(
            this,
            RegisterViewModelFactory(authRepository)
        )[RegisterViewModel::class.java]

        val recipesViewModel = ViewModelProvider(
            this,
            RecipesViewModelFactory(recipesRepository)
        )[RecipesViewModel::class.java]

        val recipeDetailViewModel = ViewModelProvider(
            this,
            RecipeDetailViewModelFactory(recipesRepository)
        )[RecipeDetailViewModel::class.java]

        val addRecipeViewModel = ViewModelProvider(
            this,
            AddRecipeViewModelFactory(recipesRepository)
        )[AddRecipeViewModel::class.java]

        setContent {
            MealPlannerTheme {
                var currentScreen by remember { mutableStateOf("splash") }
                var selectedRecipeId by remember { mutableStateOf("") }
                var selectedRecipeSource by remember { mutableStateOf("external") }
                var isAuthenticated by remember { mutableStateOf(false) }
                var currentUserName by remember { mutableStateOf<String?>(null) }

                when (currentScreen) {
                    "splash" -> SplashScreen(
                        onFinish = {
                            currentScreen = "recipes"
                        }
                    )

                    "recipes" -> RecipesScreen(
                        viewModel = recipesViewModel,
                        isAuthenticated = isAuthenticated,
                        username = currentUserName,
                        onLoginClick = { currentScreen = "login" },
                        onLogoutClick = {
                            lifecycleScope.launch {
                                tokenManager.clearToken()
                            }
                            isAuthenticated = false
                            currentUserName = null
                            currentScreen = "recipes"
                            recipesViewModel.loadRecipes()
                        },
                        onRecipeClick = { source, id ->
                            selectedRecipeSource = source
                            selectedRecipeId = id
                            currentScreen = "recipe_detail"
                        },
                        onAddRecipeClick = {
                            currentScreen = "add_recipe"
                        }
                    )

                    "login" -> LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            isAuthenticated = true
                            currentUserName =
                                loginViewModel.uiState.value.userFirstName ?: "utilisateur"
                            currentScreen = "recipes"
                            recipesViewModel.loadRecipes()
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

                    "recipe_detail" -> RecipeDetailScreen(
                        source = selectedRecipeSource,
                        id = selectedRecipeId,
                        viewModel = recipeDetailViewModel,
                        onBack = { currentScreen = "recipes" }
                    )

                    "add_recipe" -> AddRecipeScreen(
                        viewModel = addRecipeViewModel,
                        onBack = { currentScreen = "recipes" },
                        onSuccess = {
                            currentScreen = "recipes"
                            recipesViewModel.loadRecipes()
                        }
                    )
                }
            }
        }
    }
}
