/**
 * @file plannerService.js
 * @description Fonctions d'accès au backend pour la gestion du planning.
 * Ce module encapsule les requêtes HTTP liées aux repas planifiés.
 */

import api from "./api";

/**
 * Récupère les repas planifiés pour une semaine donnée.
 *
 * @param {string} date Date de référence au format YYYY-MM-DD.
 * @returns {Promise<Object[]>} Liste des éléments du planning.
 */
export async function getWeekMealPlans(date) {
  const response = await api.get("/meal-plans/week", {
    params: { date },
  });

  return response.data?.items || [];
}

/**
 * Crée un nouvel élément dans le planning.
 *
 * @param {Object} payload Corps envoyé à l'API.
 * @returns {Promise<any>} Réponse du backend.
 */
export async function createMealPlan(payload) {
  const response = await api.post("/meal-plans", payload);
  return response.data;
}

/**
 * Supprime un élément du planning par son identifiant.
 *
 * @param {number|string} id Identifiant du meal plan.
 * @returns {Promise<any>} Réponse du backend.
 */
export async function deleteMealPlan(id) {
  const response = await api.delete(`/meal-plans/${id}`);
  return response.data;
}