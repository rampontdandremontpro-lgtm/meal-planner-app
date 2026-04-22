import { useEffect, useMemo, useState } from "react";
import {
  addShoppingItem,
  deleteShoppingItem,
  getShoppingList,
  updateShoppingItem,
} from "../services/shoppingListService";

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
 * Page liste de courses.
 * Affiche :
 * - les ingrédients automatiques issus du planning
 * - les items manuels ajoutés par l'utilisateur
 * Permet :
 * - d'ajouter un ingrédient
 * - de cocher / décocher
 * - de supprimer uniquement les items manuels
 *
 * @returns {JSX.Element}
 */
export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate] = useState(getTodayDate());

  useEffect(() => {
    loadShoppingList();
  }, []);

  /**
   * Charge la liste de courses hebdomadaire depuis le backend.
   */
  async function loadShoppingList() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getShoppingList(selectedDate);
      const backendItems = data?.items || [];

      const normalized = backendItems.map((item, index) => ({
        id: item.id ?? `fallback-${index}`,
        name: item.name || "Ingrédient",
        quantity: item.quantity || "",
        unit: item.unit || "",
        checked: Boolean(item.checked),
        isManual: Boolean(item.isManual),
        source: item.source || (item.isManual ? "manual" : "automatic"),
      }));

      setItems(normalized);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Impossible de charger la liste de courses.";

      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Ajoute un ingrédient manuel à la liste.
   * Le backend exige { name, date } au minimum.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  async function handleAddManualItem(e) {
    e.preventDefault();

    const trimmed = manualInput.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      setErrorMessage("");
      setMessage("");

      await addShoppingItem({
        name: trimmed,
        date: selectedDate,
      });

      setManualInput("");
      setMessage("Ingrédient ajouté à la liste.");
      await loadShoppingList();
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Impossible d’ajouter cet ingrédient.";

      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage
      );
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Coche ou décoche un ingrédient.
   * Seuls les items manuels sont modifiables côté backend.
   *
   * @param {number|string} id
   * @param {boolean} nextChecked
   * @param {boolean} isManual
   */
  async function handleToggleChecked(id, nextChecked, isManual) {
    if (!isManual) return;

    const previousItems = [...items];

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, checked: nextChecked } : item
      )
    );

    try {
      setErrorMessage("");
      await updateShoppingItem(id, { checked: nextChecked });
    } catch (error) {
      setItems(previousItems);

      const backendMessage =
        error?.response?.data?.message ||
        "Impossible de mettre à jour cet ingrédient.";

      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage
      );
    }
  }

  /**
   * Supprime un ingrédient manuel.
   * Les items automatiques issus du planning ne doivent pas être supprimables.
   *
   * @param {number|string} id
   * @param {boolean} isManual
   */
  async function handleDeleteItem(id, isManual) {
    if (!isManual) return;

    try {
      setErrorMessage("");
      setMessage("");

      await deleteShoppingItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setMessage("Ingrédient supprimé.");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Impossible de supprimer cet ingrédient.";

      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage
      );
    }
  }

  const checkedCount = useMemo(
    () => items.filter((item) => item.checked).length,
    [items]
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Liste de courses</h1>
          <p>Gérez les ingrédients à acheter</p>
        </div>
      </div>

      <div className="shopping-summary-card">
        <p>
          {items.length} ingrédient{items.length > 1 ? "s" : ""} au total
        </p>
        <p>
          {checkedCount} coché{checkedCount > 1 ? "s" : ""}
        </p>
      </div>

      <form className="shopping-input-row" onSubmit={handleAddManualItem}>
        <input
          type="text"
          placeholder="Ajouter un ingrédient manuellement..."
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
        />
        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {message ? <p className="success-message">{message}</p> : null}
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      {loading ? (
        <div className="placeholder-card">
          <p>Chargement de la liste de courses...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="placeholder-card">
          <p>Aucun ingrédient dans la liste pour le moment.</p>
        </div>
      ) : (
        <div className="shopping-list-card">
          {items.map((item) => (
            <div className="shopping-item-row" key={item.id}>
              <label className="shopping-item-left">
                <input
                  type="checkbox"
                  checked={item.checked}
                  disabled={!item.isManual}
                  onChange={(e) =>
                    handleToggleChecked(item.id, e.target.checked, item.isManual)
                  }
                />
                <span
                  className={
                    item.checked
                      ? "shopping-item-text checked"
                      : "shopping-item-text"
                  }
                >
                  {[item.quantity, item.unit, item.name]
                    .filter(Boolean)
                    .join(" ")}
                  {!item.isManual ? " • auto" : ""}
                </span>
              </label>

              {item.isManual ? (
                <button
                  type="button"
                  className="danger-button small-danger-button"
                  onClick={() => handleDeleteItem(item.id, item.isManual)}
                >
                  Supprimer
                </button>
              ) : (
                <span className="shopping-auto-badge">Planning</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}