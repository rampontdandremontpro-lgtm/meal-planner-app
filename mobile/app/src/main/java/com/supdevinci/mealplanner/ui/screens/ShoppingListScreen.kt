package com.supdevinci.mealplanner.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.supdevinci.mealplanner.data.ShoppingListItemUi
import com.supdevinci.mealplanner.viewmodel.ShoppingListViewModel

private val ScreenBg = Color(0xFFF6F6F7)
private val MutedText = Color(0xFF667085)
private val PrimaryGreen = Color(0xFF3F9F46)
private val SoftGreen = Color(0xFFEAF7EC)
private val SoftGray = Color(0xFFEEF2F7)
private val DangerRed = Color(0xFFE5484D)
private val BorderGray = Color(0xFFE5E7EB)

@Composable
fun ShoppingListScreen(
    viewModel: ShoppingListViewModel
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadShoppingList()
    }

    val automaticItems = uiState.items.filter { it.source == "automatic" }
    val manualItems = uiState.items.filter { it.source != "automatic" }
    val checkedCount = uiState.items.count { it.checked }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = ScreenBg
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text(
                text = "Liste de courses",
                style = MaterialTheme.typography.headlineMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Gérez les ingrédients à acheter",
                color = MutedText
            )

            Spacer(modifier = Modifier.height(18.dp))

            ShoppingSummaryCard(
                total = uiState.items.size,
                checked = checkedCount
            )

            Spacer(modifier = Modifier.height(14.dp))

            AddManualItemForm(
                value = uiState.manualInput,
                isSubmitting = uiState.isSubmitting,
                onValueChange = viewModel::onManualInputChange,
                onAddClick = viewModel::addManualItem
            )

            uiState.message?.let {
                Spacer(modifier = Modifier.height(12.dp))
                MessageCard(text = it, isError = false)
            }

            uiState.errorMessage?.let {
                Spacer(modifier = Modifier.height(12.dp))
                MessageCard(text = it, isError = true)
            }

            Spacer(modifier = Modifier.height(18.dp))

            when {
                uiState.isLoading -> {
                    PlaceholderCard("Chargement de la liste de courses...")
                }

                uiState.items.isEmpty() -> {
                    PlaceholderCard("Aucun ingrédient dans la liste pour le moment.")
                }

                else -> {
                    ShoppingSection(
                        title = "Ingrédients du planning",
                        subtitle = "Ils viennent automatiquement des recettes planifiées.",
                        count = automaticItems.size,
                        emptyText = "Aucun ingrédient automatique pour le moment.",
                        items = automaticItems,
                        onToggle = viewModel::toggleItem,
                        onDelete = viewModel::deleteItem
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    ShoppingSection(
                        title = "Ingrédients ajoutés manuellement",
                        subtitle = "Ce sont les ingrédients que vous ajoutez vous-même.",
                        count = manualItems.size,
                        emptyText = "Aucun ingrédient manuel ajouté.",
                        items = manualItems,
                        onToggle = viewModel::toggleItem,
                        onDelete = viewModel::deleteItem
                    )
                }
            }
        }
    }
}

@Composable
private fun ShoppingSummaryCard(
    total: Int,
    checked: Int
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, BorderGray)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "$total ingrédient${if (total > 1) "s" else ""} au total",
                style = MaterialTheme.typography.titleMedium
            )

            Text(
                text = "$checked coché${if (checked > 1) "s" else ""}",
                color = MutedText
            )
        }
    }
}

@Composable
private fun AddManualItemForm(
    value: String,
    isSubmitting: Boolean,
    onValueChange: (String) -> Unit,
    onAddClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, BorderGray)
    ) {
        Column(
            modifier = Modifier.padding(14.dp)
        ) {
            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = value,
                onValueChange = onValueChange,
                singleLine = true,
                label = { Text("Ajouter un ingrédient manuellement") }
            )

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = onAddClick,
                enabled = !isSubmitting && value.trim().isNotEmpty(),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGreen),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(if (isSubmitting) "Ajout..." else "Ajouter")
            }
        }
    }
}

@Composable
private fun ShoppingSection(
    title: String,
    subtitle: String,
    count: Int,
    emptyText: String,
    items: List<ShoppingListItemUi>,
    onToggle: (ShoppingListItemUi, Boolean) -> Unit,
    onDelete: (ShoppingListItemUi) -> Unit
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, BorderGray)
    ) {
        Column(
            modifier = Modifier.padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleLarge
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = subtitle,
                        color = MutedText
                    )
                }

                CountBadge(count = count)
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (items.isEmpty()) {
                PlaceholderCard(emptyText)
            } else {
                Column(
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items.forEach { item ->
                        ShoppingItemRow(
                            item = item,
                            onToggle = onToggle,
                            onDelete = onDelete
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ShoppingItemRow(
    item: ShoppingListItemUi,
    onToggle: (ShoppingListItemUi, Boolean) -> Unit,
    onDelete: (ShoppingListItemUi) -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFCFCFD)),
        border = BorderStroke(1.dp, BorderGray)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = item.checked,
                    onCheckedChange = { checked ->
                        onToggle(item, checked)
                    }
                )

                Text(
                    modifier = Modifier.weight(1f),
                    text = listOf(item.quantity, item.unit, item.name)
                        .filter { it.isNotBlank() }
                        .joinToString(" "),
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (item.checked) TextDecoration.LineThrough else null,
                    color = if (item.checked) MutedText else Color(0xFF101828)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                SourceBadge(source = item.source)

                TextButton(
                    onClick = { onDelete(item) }
                ) {
                    Text(
                        text = "Supprimer",
                        color = DangerRed
                    )
                }
            }
        }
    }
}

@Composable
private fun SourceBadge(source: String) {
    val isAutomatic = source == "automatic"

    Surface(
        shape = RoundedCornerShape(14.dp),
        color = if (isAutomatic) SoftGray else SoftGreen
    ) {
        Text(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            text = if (isAutomatic) "Planning" else "Manuel",
            color = if (isAutomatic) MutedText else PrimaryGreen,
            style = MaterialTheme.typography.labelLarge
        )
    }
}

@Composable
private fun CountBadge(count: Int) {
    Surface(
        shape = RoundedCornerShape(999.dp),
        color = SoftGray
    ) {
        Text(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            text = count.toString(),
            color = MutedText,
            style = MaterialTheme.typography.labelLarge
        )
    }
}

@Composable
private fun MessageCard(
    text: String,
    isError: Boolean
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isError) Color(0xFFFFF1F1) else SoftGreen
        )
    ) {
        Text(
            modifier = Modifier.padding(14.dp),
            text = text,
            color = if (isError) DangerRed else PrimaryGreen
        )
    }
}

@Composable
private fun PlaceholderCard(text: String) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB)),
        border = BorderStroke(1.dp, BorderGray)
    ) {
        Text(
            modifier = Modifier.padding(16.dp),
            text = text,
            color = MutedText
        )
    }
}
