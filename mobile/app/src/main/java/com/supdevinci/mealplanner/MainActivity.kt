package com.supdevinci.mealplanner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.supdevinci.mealplanner.api.RetrofitClient
import com.supdevinci.mealplanner.data.TokenManager
import com.supdevinci.mealplanner.repository.AuthRepository
import com.supdevinci.mealplanner.repository.PlannerRepository
import com.supdevinci.mealplanner.repository.RecipesRepository
import com.supdevinci.mealplanner.ui.components.MobileTopNavBar
import com.supdevinci.mealplanner.ui.screens.AddRecipeScreen
import com.supdevinci.mealplanner.ui.screens.EditRecipeScreen
import com.supdevinci.mealplanner.ui.screens.LoginScreen
import com.supdevinci.mealplanner.ui.screens.PlanningScreen
import com.supdevinci.mealplanner.ui.screens.RecipeDetailScreen
import com.supdevinci.mealplanner.ui.screens.RecipesScreen
import com.supdevinci.mealplanner.ui.screens.RegisterScreen
import com.supdevinci.mealplanner.ui.screens.ShoppingPlaceholderScreen
import com.supdevinci.mealplanner.ui.screens.SplashScreen
import com.supdevinci.mealplanner.ui.theme.MealPlannerTheme
import com.supdevinci.mealplanner.viewmodel.*
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        RetrofitClient.init(applicationContext)

        val authRepository = AuthRepository()
        val recipesRepository = RecipesRepository()
        val plannerRepository = PlannerRepository()
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

        val plannerViewModel = ViewModelProvider(
            this,
            PlannerViewModelFactory(plannerRepository)
        )[PlannerViewModel::class.java]

        val editRecipeViewModel = ViewModelProvider(
            this,
            EditRecipeViewModelFactory(recipesRepository)
        )[EditRecipeViewModel::class.java]

        val recipeActionsViewModel = ViewModelProvider(
            this,
            RecipeActionsViewModelFactory(recipesRepository)
        )[RecipeActionsViewModel::class.java]

        setContent {
            MealPlannerTheme {
                var currentScreen by remember { mutableStateOf("splash") }
                var previousContentScreen by remember { mutableStateOf("recipes") }
                var selectedRecipeId by remember { mutableStateOf("") }
                var selectedRecipeSource by remember { mutableStateOf("external") }
                var isAuthenticated by remember { mutableStateOf(false) }
                var currentUserName by remember { mutableStateOf<String?>(null) }

                Column {
                    val showTopBar = currentScreen !in listOf("splash", "login", "register")

                    if (showTopBar) {
                        MobileTopNavBar(
                            currentScreen = currentScreen,
                            isAuthenticated = isAuthenticated,
                            onRecipesClick = { currentScreen = "recipes" },
                            onPlanningClick = { if (isAuthenticated) currentScreen = "planning" },
                            onShoppingClick = { if (isAuthenticated) currentScreen = "shopping" },
                            onLoginClick = {
                                loginViewModel.resetState()
                                currentScreen = "login"
                            },
                            onLogoutClick = {
                                lifecycleScope.launch {
                                    tokenManager.clearToken()
                                }
                                loginViewModel.resetState()
                                isAuthenticated = false
                                currentUserName = null
                                currentScreen = "login"
                                recipesViewModel.loadRecipes()
                            }
                        )
                    }

                    when (currentScreen) {
                        "splash" -> SplashScreen(
                            onFinish = { currentScreen = "recipes" }
                        )

                        "recipes" -> RecipesScreen(
                            viewModel = recipesViewModel,
                            isAuthenticated = isAuthenticated,
                            username = currentUserName,
                            onLoginClick = {
                                loginViewModel.resetState()
                                currentScreen = "login"
                            },
                            onLogoutClick = {},
                            onRecipeClick = { source, id ->
                                selectedRecipeSource = source
                                selectedRecipeId = id
                                previousContentScreen = "recipes"
                                currentScreen = "recipe_detail"
                            },
                            onAddRecipeClick = {
                                addRecipeViewModel.resetState()
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
                            onGoToRegister = { currentScreen = "register" }
                        )

                        "register" -> RegisterScreen(
                            viewModel = registerViewModel,
                            onBackToLogin = {
                                loginViewModel.resetState()
                                currentScreen = "login"
                            }
                        )

                        "recipe_detail" -> RecipeDetailScreen(
                            source = selectedRecipeSource,
                            id = selectedRecipeId,
                            viewModel = recipeDetailViewModel,
                            plannerViewModel = plannerViewModel,
                            recipeActionsViewModel = recipeActionsViewModel,
                            isAuthenticated = isAuthenticated,
                            onBack = { currentScreen = previousContentScreen },
                            onGoToEdit = { currentScreen = "edit_recipe" },
                            onDeleted = {
                                currentScreen = "recipes"
                                recipesViewModel.loadRecipes()
                            }
                        )

                        "add_recipe" -> AddRecipeScreen(
                            viewModel = addRecipeViewModel,
                            onBack = {
                                addRecipeViewModel.resetState()
                                currentScreen = "recipes"
                            },
                            onSuccess = {
                                addRecipeViewModel.resetState()
                                currentScreen = "recipes"
                                recipesViewModel.loadRecipes()
                            }
                        )

                        "edit_recipe" -> EditRecipeScreen(
                            recipeId = selectedRecipeId,
                            viewModel = editRecipeViewModel,
                            onBack = { currentScreen = "recipe_detail" },
                            onSaved = {
                                recipeDetailViewModel.loadRecipe("local", selectedRecipeId)
                                currentScreen = "recipe_detail"
                                recipesViewModel.loadRecipes()
                            },
                            onDeleted = {
                                currentScreen = "recipes"
                                recipesViewModel.loadRecipes()
                            }
                        )

                        "planning" -> PlanningScreen(
                            viewModel = plannerViewModel,
                            onGoToRecipes = { currentScreen = "recipes" },
                            onRecipeClick = { source, id ->
                                selectedRecipeSource = source
                                selectedRecipeId = id
                                previousContentScreen = "planning"
                                currentScreen = "recipe_detail"
                            }
                        )

                        "shopping" -> ShoppingPlaceholderScreen()
                    }
                }
            }
        }
    }
}
