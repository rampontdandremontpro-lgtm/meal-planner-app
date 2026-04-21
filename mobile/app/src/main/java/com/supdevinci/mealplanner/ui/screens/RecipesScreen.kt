package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.supdevinci.mealplanner.data.Recipe
import com.supdevinci.mealplanner.ui.components.RecipeCard
import com.supdevinci.mealplanner.viewmodel.RecipesViewModel

private val BrandGreen = Color(0xFF4CAF50)
private val ChipBorder = Color(0xFFD6D9DE)
private val ScreenBg = Color(0xFFF6F6F7)
private val MutedText = Color(0xFF667085)

@Composable
fun RecipesScreen(
    viewModel: RecipesViewModel,
    isAuthenticated: Boolean,
    username: String?,
    onLoginClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onRecipeClick: (String, String) -> Unit,
    onAddRecipeClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadRecipes()
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = ScreenBg
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text(
                text = "Découvrez nos recettes",
                style = MaterialTheme.typography.headlineMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            if (isAuthenticated && username != null) {
                Text(
                    text = "Bienvenue $username 👋",
                    color = BrandGreen,
                    style = MaterialTheme.typography.bodyLarge
                )
            } else {
                Text(
                    text = "Explorez notre collection de recettes",
                    color = MutedText,
                    style = MaterialTheme.typography.bodyLarge
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            OutlinedTextField(
                value = uiState.search,
                onValueChange = viewModel::onSearchChange,
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Rechercher une recette...") },
                singleLine = true,
                shape = RoundedCornerShape(20.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ChipBorder,
                    unfocusedBorderColor = ChipBorder,
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                uiState.categories.forEach { categoryName ->
                    val selected = categoryName == uiState.selectedCategory

                    AssistChip(
                        onClick = { viewModel.onCategorySelected(categoryName) },
                        label = { Text(categoryName) },
                        shape = RoundedCornerShape(999.dp),
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = if (selected) BrandGreen else Color.White,
                            labelColor = if (selected) Color.White else Color.Black
                        ),
                        border = BorderStroke(
                            width = 1.dp,
                            color = if (selected) BrandGreen else ChipBorder
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            if (isAuthenticated) {
                Button(
                    onClick = onAddRecipeClick,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                ) {
                    Text("Créer ma recette")
                }

                Spacer(modifier = Modifier.height(14.dp))
            }

            when {
                uiState.isLoading -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = BrandGreen)
                    }
                }

                uiState.errorMessage != null -> {
                    Text(
                        text = uiState.errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error
                    )
                }

                uiState.filteredRecipes.isEmpty() -> {
                    Card(
                        shape = RoundedCornerShape(22.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Text(
                            text = "Aucune recette trouvée.",
                            modifier = Modifier.padding(20.dp),
                            color = MutedText
                        )
                    }
                }

                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(bottom = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(
                            items = uiState.filteredRecipes,
                            key = { recipe -> "${recipe.source}-${recipe.id}" }
                        ) { recipe: Recipe ->
                            RecipeCard(
                                recipe = recipe,
                                onClick = {
                                    onRecipeClick(recipe.source, recipe.id)
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
