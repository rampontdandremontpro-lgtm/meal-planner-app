package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.supdevinci.mealplanner.viewmodel.EditRecipeViewModel

private val ScreenBg = Color(0xFFF6F6F7)
private val BrandGreen = Color(0xFF4CAF50)
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
        modifier = Modifier.fillMaxSize(),
        color = ScreenBg
    ) {
        if (uiState.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text("Modifier ma recette", style = MaterialTheme.typography.headlineMedium)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Modifie les informations de ta recette personnalisée")
                        Spacer(modifier = Modifier.height(18.dp))

                        OutlinedTextField(
                            value = uiState.title,
                            onValueChange = viewModel::onTitleChange,
                            label = { Text("Titre") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = uiState.category,
                            onValueChange = viewModel::onCategoryChange,
                            label = { Text("Catégorie") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = uiState.imageUrl,
                            onValueChange = viewModel::onImageUrlChange,
                            label = { Text("Image URL") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = uiState.prepTime,
                            onValueChange = viewModel::onPrepTimeChange,
                            label = { Text("Temps de préparation") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = uiState.servings,
                            onValueChange = viewModel::onServingsChange,
                            label = { Text("Nombre de personnes") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = uiState.instructions,
                            onValueChange = viewModel::onInstructionsChange,
                            label = { Text("Instructions") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 5
                        )

                        Spacer(modifier = Modifier.height(18.dp))
                        Text("Ingrédients", style = MaterialTheme.typography.titleLarge)
                        Spacer(modifier = Modifier.height(12.dp))

                        uiState.ingredients.forEachIndexed { index, ingredient ->
                            OutlinedTextField(
                                value = ingredient.name,
                                onValueChange = { viewModel.updateIngredient(index, name = it) },
                                label = { Text("Nom de l’ingrédient") },
                                modifier = Modifier.fillMaxWidth()
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedTextField(
                                value = ingredient.quantity,
                                onValueChange = { viewModel.updateIngredient(index, quantity = it) },
                                label = { Text("Quantité") },
                                modifier = Modifier.fillMaxWidth()
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Button(
                                onClick = { viewModel.removeIngredient(index) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = DangerBg,
                                    contentColor = DangerText
                                )
                            ) {
                                Text("Supprimer")
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = { viewModel.addIngredient() },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SecondaryBg,
                                contentColor = Color(0xFF111827)
                            )
                        ) {
                            Text("+ Ajouter un ingrédient")
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        uiState.errorMessage?.let {
                            Text(it, color = MaterialTheme.colorScheme.error)
                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = { viewModel.saveRecipe() },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                        ) {
                            Text("Enregistrer les modifications")
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Button(
                            onClick = { viewModel.deleteRecipe() },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = DangerBg,
                                contentColor = DangerText
                            )
                        ) {
                            Text("Supprimer la recette")
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        TextButton(onClick = onBack) {
                            Text("Annuler")
                        }
                    }
                }
            }
        }
    }
}
