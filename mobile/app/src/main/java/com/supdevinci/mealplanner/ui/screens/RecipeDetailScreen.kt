package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.supdevinci.mealplanner.viewmodel.PlannerViewModel
import com.supdevinci.mealplanner.viewmodel.RecipeActionsViewModel
import com.supdevinci.mealplanner.viewmodel.RecipeDetailViewModel
import kotlinx.coroutines.delay
import java.time.LocalDate

private val ScreenBg = Color(0xFFF6F6F7)
private val BrandGreen = Color(0xFF4CAF50)
private val BadgeBg = Color(0xFFF3DF9B)
private val BadgeText = Color(0xFFA16207)
private val DangerBg = Color(0xFFFEE2E2)
private val DangerText = Color(0xFFB91C1C)
private val SecondaryBg = Color(0xFFEFF2F7)
private val MutedText = Color(0xFF667085)
private val White = Color.White
private val SuccessBg = Color(0xFFE8F7EA)
private val SuccessText = Color(0xFF1F7A35)

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
                contentAlignment = Alignment.Center
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
                        .statusBarsPadding()
                ) {
                    Box {
                        AsyncImage(
                            model = if (recipe.imageUrl.isNotBlank()) {
                                recipe.imageUrl
                            } else {
                                "https://via.placeholder.com/1200x600?text=Meal+Planner"
                            },
                            contentDescription = recipe.title,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(250.dp),
                            contentScale = ContentScale.Crop
                        )

                        Surface(
                            modifier = Modifier
                                .padding(start = 16.dp, top = 16.dp)
                                .size(52.dp),
                            shape = CircleShape,
                            color = White,
                            shadowElevation = 8.dp,
                            onClick = onBack
                        ) {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "←",
                                    style = MaterialTheme.typography.titleLarge,
                                    color = Color(0xFF0F172A),
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }

                    Card(
                        modifier = Modifier
                            .padding(horizontal = 16.dp)
                            .offset(y = (-26).dp),
                        shape = RoundedCornerShape(28.dp),
                        colors = CardDefaults.cardColors(containerColor = White)
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

                            Spacer(modifier = Modifier.height(16.dp))

                            Text(
                                text = recipe.title,
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF0F172A)
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                horizontalArrangement = Arrangement.spacedBy(18.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "⏱ ${recipe.prepTime.ifBlank { "—" }}",
                                    color = MutedText,
                                    style = MaterialTheme.typography.bodyLarge
                                )

                                Text(
                                    text = "👥 ${recipe.servings ?: 2} pers.",
                                    color = MutedText,
                                    style = MaterialTheme.typography.bodyLarge
                                )

                                if (recipe.source == "local") {
                                    Text(
                                        text = "✨ Ma recette",
                                        color = MutedText,
                                        style = MaterialTheme.typography.bodyLarge
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(24.dp))

                            Text(
                                text = "Ingrédients",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            recipe.ingredients.forEach { ingredient ->
                                Text(
                                    text = "• ${
                                        listOf(
                                            ingredient.quantity,
                                            ingredient.unit,
                                            ingredient.name
                                        ).filter { it.isNotBlank() }.joinToString(" ")
                                    }",
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = Color(0xFF0F172A)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                            }

                            Spacer(modifier = Modifier.height(24.dp))

                            Text(
                                text = "Instructions",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = recipe.instructions,
                                style = MaterialTheme.typography.bodyLarge,
                                color = Color(0xFF0F172A)
                            )

                            Spacer(modifier = Modifier.height(24.dp))

                            if (isAuthenticated) {
                                Button(
                                    onClick = { showPlannerDialog = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(18.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                                ) {
                                    Text("Ajouter au planning")
                                }
                            }

                            if (canEditOrDelete) {
                                Spacer(modifier = Modifier.height(12.dp))

                                Button(
                                    onClick = onGoToEdit,
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(18.dp),
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
                                    shape = RoundedCornerShape(18.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = DangerBg,
                                        contentColor = DangerText
                                    ),
                                    enabled = !actionsState.isDeleting
                                ) {
                                    Text(
                                        if (actionsState.isDeleting) "Suppression..." else "Supprimer la recette"
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
    var selectedMealType by remember { mutableStateOf("DINNER") }
    var feedbackMessage by remember { mutableStateOf<String?>(null) }
    var feedbackIsError by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }
    var shouldCloseAfterFeedback by remember { mutableStateOf(false) }

    val mealOptions = listOf(
        "BREAKFAST" to "Petit-déjeuner",
        "LUNCH" to "Déjeuner",
        "DINNER" to "Dîner"
    )

    LaunchedEffect(feedbackMessage, shouldCloseAfterFeedback) {
        if (!feedbackMessage.isNullOrBlank()) {
            delay(2200)
            if (shouldCloseAfterFeedback) {
                onDismiss()
            } else {
                feedbackMessage = null
            }
        }
    }

    AlertDialog(
        onDismissRequest = {
            if (!isSubmitting) onDismiss()
        },
        confirmButton = {
            Button(
                onClick = {
                    isSubmitting = true
                    feedbackMessage = null
                    shouldCloseAfterFeedback = false

                    plannerViewModel.addMealPlan(
                        date = selectedDate,
                        mealType = selectedMealType,
                        recipeId = recipeId,
                        source = source,
                        onSuccess = {
                            isSubmitting = false
                            feedbackIsError = false
                            feedbackMessage = "Recette ajoutée au planning."
                            shouldCloseAfterFeedback = true
                        },
                        onError = { message ->
                            isSubmitting = false
                            feedbackIsError = true

                            val normalizedMessage = when {
                                message.contains("400", ignoreCase = true) ->
                                    "Un repas existe déjà pour ce jour et ce type de repas."
                                message.contains("already", ignoreCase = true) ->
                                    "Un repas existe déjà pour ce jour et ce type de repas."
                                message.contains("exists", ignoreCase = true) ->
                                    "Un repas existe déjà pour ce jour et ce type de repas."
                                message.contains("duplicate", ignoreCase = true) ->
                                    "Un repas existe déjà pour ce jour et ce type de repas."
                                else -> message
                            }

                            feedbackMessage = normalizedMessage
                            shouldCloseAfterFeedback = false
                        }
                    )
                },
                enabled = !isSubmitting,
                colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
            ) {
                Text(if (isSubmitting) "Envoi..." else "Confirmer")
            }
        },
        dismissButton = {
            TextButton(
                onClick = {
                    if (!isSubmitting) onDismiss()
                }
            ) {
                Text("Annuler", color = MutedText)
            }
        },
        title = { Text("Ajouter au planning") },
        text = {
            Column {
                OutlinedTextField(
                    value = selectedDate,
                    onValueChange = { selectedDate = it },
                    label = { Text("Date (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(14.dp))

                mealOptions.forEach { (value, label) ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(
                            selected = selectedMealType == value,
                            onClick = { selectedMealType = value }
                        )
                        Text(label)
                    }
                }

                if (!feedbackMessage.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(14.dp))

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (feedbackIsError) DangerBg else SuccessBg
                    ) {
                        Text(
                            text = feedbackMessage ?: "",
                            color = if (feedbackIsError) DangerText else SuccessText,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }
    )
}
