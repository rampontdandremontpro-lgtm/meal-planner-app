package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.supdevinci.mealplanner.data.MealPlanItem
import com.supdevinci.mealplanner.viewmodel.PlannerViewModel
import java.time.LocalDate

private val ScreenBg = Color(0xFFF6F6F7)
private val BreakfastBorder = Color(0xFFF2D46F)
private val LunchBorder = Color(0xFFB9D7FF)
private val DinnerBorder = Color(0xFFE3C7FF)
private val MutedText = Color(0xFF667085)

@Composable
fun PlanningScreen(
    viewModel: PlannerViewModel,
    onGoToRecipes: () -> Unit,
    onRecipeClick: (String, String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadWeek()
    }

    val days = (0..6).map { uiState.weekStart.plusDays(it.toLong()) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = ScreenBg
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text("Planning des repas", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Organisez vos repas de la semaine", color = MutedText)
            Spacer(modifier = Modifier.height(18.dp))

            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { viewModel.goPreviousWeek() }) {
                        Text("←")
                    }

                    Text(
                        text = "Semaine du ${uiState.weekStart}",
                        style = MaterialTheme.typography.titleLarge
                    )

                    IconButton(onClick = { viewModel.goNextWeek() }) {
                        Text("→")
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            uiState.errorMessage?.let {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.error
                )
                Spacer(modifier = Modifier.height(10.dp))
            }

            Row(
                modifier = Modifier.horizontalScroll(rememberScrollState())
            ) {
                Column {
                    Spacer(modifier = Modifier.height(34.dp))

                    PlannerRowLabel("Petit-déjeuner")
                    Spacer(modifier = Modifier.height(18.dp))
                    PlannerRowLabel("Déjeuner")
                    Spacer(modifier = Modifier.height(18.dp))
                    PlannerRowLabel("Dîner")
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        days.forEach { day ->
                            Text(
                                text = "${frenchDay(day)} ${day.dayOfMonth}",
                                modifier = Modifier.width(120.dp),
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    PlannerMealRow(
                        days = days,
                        items = uiState.items,
                        mealType = "BREAKFAST",
                        borderColor = BreakfastBorder,
                        onGoToRecipes = onGoToRecipes,
                        onRecipeClick = onRecipeClick,
                        onRemove = viewModel::removeMealPlan
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    PlannerMealRow(
                        days = days,
                        items = uiState.items,
                        mealType = "LUNCH",
                        borderColor = LunchBorder,
                        onGoToRecipes = onGoToRecipes,
                        onRecipeClick = onRecipeClick,
                        onRemove = viewModel::removeMealPlan
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    PlannerMealRow(
                        days = days,
                        items = uiState.items,
                        mealType = "DINNER",
                        borderColor = DinnerBorder,
                        onGoToRecipes = onGoToRecipes,
                        onRecipeClick = onRecipeClick,
                        onRemove = viewModel::removeMealPlan
                    )
                }
            }
        }
    }
}

@Composable
private fun PlannerRowLabel(text: String) {
    Box(
        modifier = Modifier
            .height(120.dp)
            .width(120.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Text(text = text, style = MaterialTheme.typography.titleMedium)
    }
}

@Composable
private fun PlannerMealRow(
    days: List<LocalDate>,
    items: List<MealPlanItem>,
    mealType: String,
    borderColor: Color,
    onGoToRecipes: () -> Unit,
    onRecipeClick: (String, String) -> Unit,
    onRemove: (Int) -> Unit
) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        days.forEach { day ->
            val item = items.find {
                it.date == day.toString() && it.mealType == mealType
            }

            Card(
                modifier = Modifier
                    .width(120.dp)
                    .height(120.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(2.dp, borderColor)
            ) {
                if (item == null) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clickable { onGoToRecipes() },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "+",
                            style = MaterialTheme.typography.headlineLarge,
                            color = MutedText
                        )
                    }
                } else {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(8.dp)
                    ) {
                        AsyncImage(
                            model = if (item.recipe.imageUrl.isNotBlank()) {
                                item.recipe.imageUrl
                            } else {
                                "https://via.placeholder.com/400x300?text=Meal+Planner"
                            },
                            contentDescription = item.recipe.title,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(42.dp)
                                .clickable {
                                    onRecipeClick(item.recipe.source, item.recipe.id)
                                },
                            contentScale = ContentScale.Crop
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = item.recipe.title,
                            style = MaterialTheme.typography.bodySmall,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        TextButton(
                            onClick = { onRemove(item.id) },
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text("Retirer", color = Color(0xFFE11D48))
                        }
                    }
                }
            }
        }
    }
}

private fun frenchDay(date: LocalDate): String {
    return when (date.dayOfWeek.value) {
        1 -> "Lundi"
        2 -> "Mardi"
        3 -> "Mercredi"
        4 -> "Jeudi"
        5 -> "Vendredi"
        6 -> "Samedi"
        else -> "Dimanche"
    }
}
