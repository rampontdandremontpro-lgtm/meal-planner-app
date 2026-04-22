package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.supdevinci.mealplanner.viewmodel.EditRecipeViewModel

private val ScreenBg = Color(0xFFF6F6F7)
private val CardBg = Color.White
private val BrandGreen = Color(0xFF4CAF50)
private val MutedText = Color(0xFF667085)
private val BorderColor = Color(0xFFD6D9DE)
private val DangerBg = Color(0xFFFEE2E2)
private val DangerText = Color(0xFFB91C1C)
private val SecondaryBg = Color(0xFFEFF2F7)

@Composable
fun EditRecipeScreen(
    recipeId: String,
    viewModel: EditRecipeViewModel,
    onBack: () -> Unit,
    onSaved: () -> Unit,
    onDeleted: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(recipeId) {
        viewModel.loadRecipe(recipeId)
    }

    LaunchedEffect(uiState.isSaved) {
        if (uiState.isSaved) onSaved()
    }

    LaunchedEffect(uiState.isDeleted) {
        if (uiState.isDeleted) onDeleted()
    }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding(),
        color = ScreenBg
    ) {
        if (uiState.isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                Card(
                    modifier = Modifier.fillMaxSize(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(20.dp),
                        verticalArrangement = Arrangement.Top
                    ) {
                        Text(
                            text = "Modifier ma recette",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0F172A)
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Modifie les informations de ta recette personnalisée",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MutedText
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        RecipeEditInput(
                            value = uiState.title,
                            onValueChange = viewModel::onTitleChange,
                            label = "Titre"
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        RecipeEditInput(
                            value = uiState.category,
                            onValueChange = viewModel::onCategoryChange,
                            label = "Catégorie"
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        RecipeEditInput(
                            value = uiState.imageUrl,
                            onValueChange = viewModel::onImageUrlChange,
                            label = "Image URL"
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        RecipeEditInput(
                            value = uiState.prepTime,
                            onValueChange = viewModel::onPrepTimeChange,
                            label = "Temps de préparation"
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        RecipeEditInput(
                            value = uiState.servings,
                            onValueChange = viewModel::onServingsChange,
                            label = "Nombre de personnes"
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        OutlinedTextField(
                            value = uiState.instructions,
                            onValueChange = viewModel::onInstructionsChange,
                            label = { Text("Instructions") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 5,
                            shape = RoundedCornerShape(18.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BorderColor,
                                unfocusedBorderColor = BorderColor,
                                focusedContainerColor = Color.White,
                                unfocusedContainerColor = Color.White
                            )
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        HorizontalDivider(color = Color(0xFFE5E7EB))

                        Spacer(modifier = Modifier.height(20.dp))

                        Text(
                            text = "Ingrédients",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        uiState.ingredients.forEachIndexed { index, ingredient ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(18.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB))
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    RecipeEditInput(
                                        value = ingredient.name,
                                        onValueChange = {
                                            viewModel.updateIngredient(index, name = it)
                                        },
                                        label = "Nom de l’ingrédient"
                                    )

                                    Spacer(modifier = Modifier.height(10.dp))

                                    RecipeEditInput(
                                        value = ingredient.quantity,
                                        onValueChange = {
                                            viewModel.updateIngredient(index, quantity = it)
                                        },
                                        label = "Quantité"
                                    )

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Button(
                                        onClick = { viewModel.removeIngredient(index) },
                                        shape = RoundedCornerShape(14.dp),
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = DangerBg,
                                            contentColor = DangerText
                                        )
                                    ) {
                                        Text("Supprimer")
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = { viewModel.addIngredient() },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SecondaryBg,
                                contentColor = Color(0xFF111827)
                            )
                        ) {
                            Text("+ Ajouter un ingrédient")
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        uiState.errorMessage?.let {
                            Text(
                                text = it,
                                color = MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = { viewModel.saveRecipe() },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp),
                            enabled = !uiState.isSaving,
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                        ) {
                            if (uiState.isSaving) {
                                CircularProgressIndicator(
                                    color = Color.White,
                                    modifier = Modifier.height(20.dp)
                                )
                            } else {
                                Text("Enregistrer les modifications")
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        TextButton(
                            onClick = onBack,
                            modifier = Modifier.align(Alignment.CenterHorizontally)
                        ) {
                            Text("Annuler", color = MutedText)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RecipeEditInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        singleLine = true,
        shape = RoundedCornerShape(18.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = BorderColor,
            unfocusedBorderColor = BorderColor,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White
        )
    )
}
