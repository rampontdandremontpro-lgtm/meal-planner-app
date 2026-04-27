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
 * Le backend attend GET /shopping-list/week?date=YYYY-MM-DD.
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
 * Le backend attend POST /shopping-list/items avec :
 * { name, quantity?, unit?, date }
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
