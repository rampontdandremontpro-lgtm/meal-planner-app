package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.supdevinci.mealplanner.data.Recipe
import com.supdevinci.mealplanner.viewmodel.RecipesViewModel

private val BrandGreen = Color(0xFF4CAF50)
private val ChipBorder = Color(0xFFD6D9DE)
private val ScreenBg = Color(0xFFF6F6F7)
private val CardBg = Color.White
private val MutedText = Color(0xFF667085)
private val BadgeBg = Color(0xFFF3DF9B)
private val BadgeText = Color(0xFFA16207)

@Composable
fun RecipesScreen(
    viewModel: RecipesViewModel,
    isAuthenticated: Boolean,
    username: String?,
    onLoginClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onRecipeClick: (source: String, id: String) -> Unit,
    onAddRecipeClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(isAuthenticated) {
        viewModel.loadRecipes()
    }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding(),
        color = ScreenBg
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            MobileRecipesTopBar(
                isAuthenticated = isAuthenticated,
                onLoginClick = onLoginClick,
                onLogoutClick = onLogoutClick
            )

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Text(
                        text = "Découvrez nos recettes",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (isAuthenticated) {
                            "Bienvenue ${username ?: "utilisateur"} 👋"
                        } else {
                            "Explorez notre collection de recettes"
                        },
                        color = if (isAuthenticated) BrandGreen else MutedText,
                        style = MaterialTheme.typography.bodyLarge
                    )
                }

                item {
                    OutlinedTextField(
                        value = uiState.search,
                        onValueChange = viewModel::onSearchChange,
                        placeholder = {
                            Text("Rechercher une recette...")
                        },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(20.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = ChipBorder,
                            unfocusedBorderColor = ChipBorder,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        )
                    )
                }

                item {
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        uiState.categories.forEach { category ->
                            val selected = category == uiState.selectedCategory

                            AssistChip(
                                onClick = { viewModel.onCategorySelected(category) },
                                label = {
                                    Text(
                                        text = category,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                },
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
                }

                if (isAuthenticated) {
                    item {
                        Button(
                            onClick = onAddRecipeClick,
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BrandGreen
                            )
                        ) {
                            Text("Créer ma recette")
                        }
                    }
                }

                when {
                    uiState.isLoading -> {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 40.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(color = BrandGreen)
                            }
                        }
                    }

                    uiState.errorMessage != null -> {
                        item {
                            Text(
                                text = uiState.errorMessage ?: "",
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                    }

                    uiState.filteredRecipes.isEmpty() -> {
                        item {
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
                    }

                    else -> {
                        items(uiState.filteredRecipes) { recipe ->
                            RecipeMobileCard(
                                recipe = recipe,
                                onClick = { onRecipeClick(recipe.source, recipe.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MobileRecipesTopBar(
    isAuthenticated: Boolean,
    onLoginClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = "👨‍🍳", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Meal Planner",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
            }

            if (isAuthenticated) {
                TextButton(onClick = onLogoutClick) {
                    Text("Déconnexion", color = BrandGreen, fontWeight = FontWeight.Bold)
                }
            } else {
                Button(
                    onClick = onLoginClick,
                    shape = RoundedCornerShape(999.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                ) {
                    Text("Connexion")
                }
            }
        }

        HorizontalDivider(color = Color(0xFFE5E7EB))
    }
}

@Composable
private fun RecipeMobileCard(
    recipe: Recipe,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column {
            AsyncImage(
                model = recipe.imageUrl,
                contentDescription = recipe.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(210.dp),
                contentScale = ContentScale.Crop
            )

            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = recipe.title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(12.dp))

                CategoryBadge(recipe.category)

                if (recipe.source == "local") {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Ma recette",
                        color = BrandGreen,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Composable
private fun CategoryBadge(text: String) {
    Surface(
        shape = RoundedCornerShape(999.dp),
        color = BadgeBg
    ) {
        Text(
            text = text,
            color = BadgeText,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            style = MaterialTheme.typography.bodyMedium
        )
    }
}
