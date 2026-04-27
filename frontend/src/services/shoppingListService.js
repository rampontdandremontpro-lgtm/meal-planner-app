/**
 * @file shoppingListService.js
 * @description Fonctions de service dédiées à la liste de courses.
 * Ce module isole les appels HTTP pour les ingrédients manuels et automatiques
 * afin que les composants React ne manipulent pas directement les routes API.
 */

import api from "./api";

/**
 * Retourne la date du jour au format YYYY-MM-DD.
 * @returns {string}
 */
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Récupère la liste de courses de la semaine.
 *
 * @param {string} [date]
 * @returns {Promise<{weekStart:string,weekEnd:string,items:Array}>}
 */
export async function getShoppingList(date = getTodayDate()) {
  const response = await api.get("/shopping-list/week", {
    params: { date },
  });

  return response.data;
}

/**
 * Ajoute un ingrédient manuel.
 *
 * @param {{name:string, quantity?:string, unit?:string, date?:string}} payload
 * @returns {Promise<Object>}
 */
export async function addShoppingItem(payload) {
  const response = await api.post("/shopping-list/items", {
    name: payload.name,
    quantity: payload.quantity || "",
    unit: payload.unit || "",
    date: payload.date || getTodayDate(),
  });

  return response.data;
}

/**
 * Met à jour uniquement l'état checked d'un item manuel.
 *
 * @param {number|string} id
 * @param {{checked:boolean}} payload
 * @returns {Promise<Object>}
 */
export async function updateShoppingItem(id, payload) {
  const response = await api.patch(`/shopping-list/items/${id}`, {
    checked: payload.checked,
  });

  return response.data;
}

/**
 * Supprime un item manuel.
 *
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function deleteShoppingItem(id) {
  const response = await api.delete(`/shopping-list/items/${id}`);

  return response.data;
}

/**
 * Nettoie le payload d'un ingrédient automatique.
 * Le backend ne veut pas recevoir recipeId:null ou externalRecipeId:null.
 *
 * @param {Object} payload
 * @returns {Object}
 */
function buildAutoShoppingPayload(payload) {
  const body = {
    date: payload.date,
    ingredientName: payload.ingredientName,
    quantity: payload.quantity || "",
    unit: payload.unit || "",
  };

  if (payload.recipeId !== null && payload.recipeId !== undefined) {
    const recipeIdAsNumber = Number(payload.recipeId);

    if (Number.isInteger(recipeIdAsNumber)) {
      body.recipeId = recipeIdAsNumber;
    }
  }

  if (
    payload.externalRecipeId !== null &&
    payload.externalRecipeId !== undefined &&
    String(payload.externalRecipeId).trim() !== ""
  ) {
    body.externalRecipeId = String(payload.externalRecipeId);
  }

  return body;
}

/**
 * Coche / décoche un ingrédient automatique issu du planning.
 *
 * @param {{
 * date:string,
 * recipeId?:number|string|null,
 * externalRecipeId?:string|number|null,
 * ingredientName:string,
 * quantity?:string,
 * unit?:string,
 * checked:boolean
 * }} payload
 * @returns {Promise<Object>}
 */
export async function updateAutoShoppingItem(payload) {
  const body = {
    ...buildAutoShoppingPayload(payload),
    checked: payload.checked,
  };

  const response = await api.patch("/shopping-list/auto", body);

  return response.data;
}

/**
 * Masque un ingrédient automatique issu du planning.
 *
 * @param {{
 * date:string,
 * recipeId?:number|string|null,
 * externalRecipeId?:string|number|null,
 * ingredientName:string,
 * quantity?:string,
 * unit?:string,
 * hidden:boolean
 * }} payload
 * @returns {Promise<Object>}
 */
export async function hideAutoShoppingItem(payload) {
  const body = {
    ...buildAutoShoppingPayload(payload),
    hidden: payload.hidden,
  };

  const response = await api.patch("/shopping-list/auto/hide", body);

  return response.data;
}