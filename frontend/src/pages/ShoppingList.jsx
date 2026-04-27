import { useEffect, useMemo, useState } from "react";
import {
  addShoppingItem,
  deleteShoppingItem,
  getShoppingList,
  hideAutoShoppingItem,
  updateAutoShoppingItem,
  updateShoppingItem,
} from "../services/shoppingListService";

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toIntegerOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : null;
}

function toStringOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

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

  async function loadShoppingList() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getShoppingList(selectedDate);
      const backendItems = data?.items || [];

      const normalized = backendItems.map((item, index) => {
        const source = item.source || (item.isManual ? "manual" : "automatic");
        const ingredientName = item.ingredientName || item.name || "Ingrédient";
        const recipeId = toIntegerOrNull(item.recipeId);
        const externalRecipeId = toStringOrNull(item.externalRecipeId);

        return {
          id:
            item.id ??
            `auto-${
              recipeId || externalRecipeId || "unknown"
            }-${ingredientName}-${index}`,
          name: item.name || ingredientName,
          ingredientName,
          quantity: item.quantity || "",
          unit: item.unit || "",
          checked: Boolean(item.checked),
          isManual: Boolean(item.isManual),
          source,
          recipeId,
          externalRecipeId,
          weekStart: item.weekStart || data?.weekStart || selectedDate,
        };
      });

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

  async function handleAddManualItem(e) {
    e.preventDefault();

    const trimmed = manualInput.trim();

    if (!trimmed) {
      return;
    }

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

  async function handleToggleChecked(item, nextChecked) {
    const previousItems = [...items];

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, checked: nextChecked }
          : currentItem
      )
    );

    try {
      setErrorMessage("");
      setMessage("");

      if (item.source === "automatic") {
        await updateAutoShoppingItem({
          date: item.weekStart || selectedDate,
          recipeId: item.recipeId,
          externalRecipeId: item.externalRecipeId,
          ingredientName: item.ingredientName || item.name,
          quantity: item.quantity || "",
          unit: item.unit || "",
          checked: nextChecked,
        });
      } else {
        await updateShoppingItem(item.id, {
          checked: nextChecked,
        });
      }
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

  async function handleDeleteItem(item) {
    try {
      setErrorMessage("");
      setMessage("");

      if (item.source === "automatic") {
        await hideAutoShoppingItem({
          date: item.weekStart || selectedDate,
          recipeId: item.recipeId,
          externalRecipeId: item.externalRecipeId,
          ingredientName: item.ingredientName || item.name,
          quantity: item.quantity || "",
          unit: item.unit || "",
          hidden: true,
        });
      } else {
        await deleteShoppingItem(item.id);
      }

      setItems((current) =>
        current.filter((currentItem) => currentItem.id !== item.id)
      );

      setMessage("Ingrédient supprimé de la liste.");
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

  function renderItems(list) {
    return list.map((item) => (
      <div className="shopping-item-row" key={item.id}>
        <label className="shopping-item-left">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => handleToggleChecked(item, e.target.checked)}
          />

          <span
            className={
              item.checked ? "shopping-item-text checked" : "shopping-item-text"
            }
          >
            {[item.quantity, item.unit, item.name].filter(Boolean).join(" ")}
          </span>
        </label>

        <div className="shopping-item-actions">
          {item.source === "automatic" ? (
            <span className="shopping-auto-badge">Planning</span>
          ) : (
            <span className="shopping-manual-badge">Manuel</span>
          )}

          <button
            type="button"
            className="danger-button small-danger-button"
            onClick={() => handleDeleteItem(item)}
          >
            Supprimer
          </button>
        </div>
      </div>
    ));
  }

  const automaticItems = useMemo(
    () => items.filter((item) => item.source === "automatic"),
    [items]
  );

  const manualItems = useMemo(
    () => items.filter((item) => item.source !== "automatic"),
    [items]
  );

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

        <button type="submit" className="primary-button" disabled={submitting}>
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
        <div className="shopping-sections">
          <section className="shopping-section-card">
            <div className="shopping-section-header">
              <div>
                <h2>Ingrédients du planning</h2>
                <p>Ils viennent automatiquement des recettes planifiées.</p>
              </div>

              <span className="shopping-section-count">
                {automaticItems.length}
              </span>
            </div>

            {automaticItems.length > 0 ? (
              <div className="shopping-list-card">
                {renderItems(automaticItems)}
              </div>
            ) : (
              <div className="shopping-section-empty">
                Aucun ingrédient automatique pour le moment.
              </div>
            )}
          </section>

          <section className="shopping-section-card">
            <div className="shopping-section-header">
              <div>
                <h2>Ingrédients ajoutés manuellement</h2>
                <p>Ce sont les ingrédients que vous ajoutez vous-même.</p>
              </div>

              <span className="shopping-section-count">
                {manualItems.length}
              </span>
            </div>

            {manualItems.length > 0 ? (
              <div className="shopping-list-card">{renderItems(manualItems)}</div>
            ) : (
              <div className="shopping-section-empty">
                Aucun ingrédient manuel ajouté.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}