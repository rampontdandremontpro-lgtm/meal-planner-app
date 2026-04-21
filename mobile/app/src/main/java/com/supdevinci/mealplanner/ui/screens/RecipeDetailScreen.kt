package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.supdevinci.mealplanner.viewmodel.PlannerViewModel
import com.supdevinci.mealplanner.viewmodel.RecipeActionsViewModel
import com.supdevinci.mealplanner.viewmodel.RecipeDetailViewModel
import java.time.LocalDate

private val ScreenBg = Color(0xFFF6F6F7)
private val BrandGreen = Color(0xFF4CAF50)
private val BadgeBg = Color(0xFFF3DF9B)
private val BadgeText = Color(0xFFA16207)
private val DangerBg = Color(0xFFFEE2E2)
private val DangerText = Color(0xFFB91C1C)
private val SecondaryBg = Color(0xFFEFF2F7)

@Composable
fun RecipeDetailScreen(
    source: String,
    id: String,
    viewModel: RecipeDetailViewModel,
    plannerViewModel: PlannerViewModel,
    recipeActionsViewModel: RecipeActionsViewModel,
    isAuthenticated: Boolean,
    onBack: () -> Unit,
    onGoToEdit: () -> Unit,
    onDeleted: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val actionsState by recipeActionsViewModel.uiState.collectAsState()

    var showPlannerDialog by remember { mutableStateOf(false) }
    var showDeleteDialog by remember { mutableStateOf(false) }

    LaunchedEffect(source, id) {
        viewModel.loadRecipe(source, id)
        recipeActionsViewModel.resetState()
    }

    LaunchedEffect(actionsState.isDeleted) {
        if (actionsState.isDeleted) {
            onDeleted()
        }
    }

    when {
        uiState.isLoading -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = androidx.compose.ui.Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }

        uiState.errorMessage != null -> {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(uiState.errorMessage ?: "", color = MaterialTheme.colorScheme.error)
            }
        }

        uiState.recipe != null -> {
            val recipe = uiState.recipe!!
            val canEditOrDelete = isAuthenticated && recipe.source == "local"

            Surface(
                modifier = Modifier.fillMaxSize(),
                color = ScreenBg
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    AsyncImage(
                        model = recipe.imageUrl,
                        contentDescription = recipe.title,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp),
                        contentScale = ContentScale.Crop
                    )

                    Column(modifier = Modifier.padding(16.dp)) {
                        TextButton(onClick = onBack) {
                            Text("← Retour")
                        }

                        Card(
                            shape = RoundedCornerShape(24.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White)
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Surface(
                                    shape = RoundedCornerShape(999.dp),
                                    color = BadgeBg
                                ) {
                                    Text(
                                        text = recipe.category,
                                        color = BadgeText,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Text(
                                    text = recipe.title,
                                    style = MaterialTheme.typography.headlineMedium,
                                    fontWeight = FontWeight.Bold
                                )

                                Spacer(modifier = Modifier.height(16.dp))

                                Text("Ingrédients", style = MaterialTheme.typography.titleLarge)
                                Spacer(modifier = Modifier.height(10.dp))

                                recipe.ingredients.forEach { ingredient ->
                                    Text("• ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}".trim())
                                    Spacer(modifier = Modifier.height(6.dp))
                                }

                                Spacer(modifier = Modifier.height(20.dp))

                                Text("Instructions", style = MaterialTheme.typography.titleLarge)
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(recipe.instructions)

                                Spacer(modifier = Modifier.height(24.dp))

                                Button(
                                    onClick = { showPlannerDialog = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(16.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                                ) {
                                    Text("Ajouter au planning")
                                }

                                if (canEditOrDelete) {
                                    Spacer(modifier = Modifier.height(12.dp))

                                    Button(
                                        onClick = onGoToEdit,
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(16.dp),
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = SecondaryBg,
                                            contentColor = Color(0xFF111827)
                                        )
                                    ) {
                                        Text("Modifier la recette")
                                    }

                                    Spacer(modifier = Modifier.height(12.dp))

                                    Button(
                                        onClick = { showDeleteDialog = true },
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(16.dp),
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = DangerBg,
                                            contentColor = DangerText
                                        ),
                                        enabled = !actionsState.isDeleting
                                    ) {
                                        Text(
                                            if (actionsState.isDeleting) {
                                                "Suppression..."
                                            } else {
                                                "Supprimer la recette"
                                            }
                                        )
                                    }

                                    actionsState.errorMessage?.let {
                                        Spacer(modifier = Modifier.height(12.dp))
                                        Text(it, color = MaterialTheme.colorScheme.error)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (showPlannerDialog) {
                AddToPlanningDialog(
                    recipeId = recipe.id,
                    source = recipe.source,
                    plannerViewModel = plannerViewModel,
                    onDismiss = { showPlannerDialog = false }
                )
            }

            if (showDeleteDialog) {
                AlertDialog(
                    onDismissRequest = { showDeleteDialog = false },
                    title = { Text("Supprimer la recette") },
                    text = { Text("Voulez-vous vraiment supprimer cette recette ?") },
                    confirmButton = {
                        Button(
                            onClick = {
                                showDeleteDialog = false
                                recipeActionsViewModel.deleteRecipe(recipe.id)
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = DangerBg,
                                contentColor = DangerText
                            )
                        ) {
                            Text("Supprimer")
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showDeleteDialog = false }) {
                            Text("Annuler")
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun AddToPlanningDialog(
    recipeId: String,
    source: String,
    plannerViewModel: PlannerViewModel,
    onDismiss: () -> Unit
) {
    var selectedDate by remember { mutableStateOf(LocalDate.now().toString()) }
    var selectedMealType by remember { mutableStateOf("LUNCH") }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = {
                    plannerViewModel.addMealPlan(
                        date = selectedDate,
                        mealType = selectedMealType,
                        recipeId = recipeId,
                        source = source,
                        onSuccess = onDismiss
                    )
                }
            ) {
                Text("Confirmer")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Annuler")
            }
        },
        title = {
            Text("Ajouter au planning")
        },
        text = {
            Column {
                OutlinedTextField(
                    value = selectedDate,
                    onValueChange = { selectedDate = it },
                    label = { Text("Date (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                val options = listOf("BREAKFAST", "LUNCH", "DINNER")
                options.forEach { option ->
                    Row {
                        RadioButton(
                            selected = selectedMealType == option,
                            onClick = { selectedMealType = option }
                        )
                        Text(option)
                    }
                }
            }
        }
    )
}
