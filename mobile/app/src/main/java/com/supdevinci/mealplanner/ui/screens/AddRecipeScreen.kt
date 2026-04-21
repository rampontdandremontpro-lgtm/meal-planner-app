package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.supdevinci.mealplanner.viewmodel.AddRecipeViewModel

@Composable
fun AddRecipeScreen(
    viewModel: AddRecipeViewModel,
    onBack: () -> Unit,
    onSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.isSuccess) {
        if (uiState.isSuccess) onSuccess()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        TextButton(onClick = onBack) {
            Text("← Retour")
        }

        Text("Créer ma recette", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))

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
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))
        Text("Ingrédients", style = MaterialTheme.typography.titleMedium)

        uiState.ingredients.forEachIndexed { index, ingredient ->
            Spacer(modifier = Modifier.height(12.dp))

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

            TextButton(onClick = { viewModel.removeIngredient(index) }) {
                Text("Supprimer cet ingrédient")
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        TextButton(onClick = { viewModel.addIngredient() }) {
            Text("+ Ajouter un ingrédient")
        }

        Spacer(modifier = Modifier.height(16.dp))

        uiState.errorMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.error)
            Spacer(modifier = Modifier.height(8.dp))
        }

        Button(
            onClick = { viewModel.submit() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(if (uiState.isLoading) "Création..." else "Créer la recette")
        }
    }
}
