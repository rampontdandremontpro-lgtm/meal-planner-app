package com.supdevinci.mealplanner.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

private val BrandGreen = Color(0xFF4CAF50)
private val BorderColor = Color(0xFFE5E7EB)
private val MutedText = Color(0xFF667085)
private val White = Color.White
private val DangerRed = Color(0xFFEF4444)

@Composable
fun MobileTopNavBar(
    currentScreen: String,
    isAuthenticated: Boolean,
    onRecipesClick: () -> Unit,
    onPlanningClick: () -> Unit,
    onShoppingClick: () -> Unit,
    onLoginClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(White)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = "👨‍🍳")
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Meal Planner",
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )
            }

            if (!isAuthenticated) {
                Button(
                    onClick = onLoginClick,
                    shape = RoundedCornerShape(999.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
                ) {
                    Text("Connexion")
                }
            }
        }

        if (isAuthenticated) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(start = 14.dp, end = 14.dp, bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TopNavChip(
                    text = "Recettes",
                    selected = currentScreen == "recipes",
                    onClick = onRecipesClick
                )

                TopNavChip(
                    text = "Planning",
                    selected = currentScreen == "planning",
                    onClick = onPlanningClick
                )

                TopNavChip(
                    text = "Courses",
                    selected = currentScreen == "shopping",
                    onClick = onShoppingClick
                )

                TextButton(onClick = onLogoutClick) {
                    Text(
                        text = "Déconnexion",
                        color = DangerRed,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        HorizontalDivider(color = BorderColor)
    }
}

@Composable
private fun TopNavChip(
    text: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    if (selected) {
        Button(
            onClick = onClick,
            shape = RoundedCornerShape(999.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandGreen)
        ) {
            Text(text)
        }
    } else {
        Surface(
            shape = RoundedCornerShape(999.dp),
            color = Color.White,
            tonalElevation = 0.dp,
            shadowElevation = 0.dp
        ) {
            TextButton(onClick = onClick) {
                Text(
                    text = text,
                    color = MutedText,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
