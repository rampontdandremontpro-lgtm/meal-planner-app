/**
 * @file ShoppingList.stories.jsx
 * @description Stories Storybook de la page liste de courses.
 * Reproduit visuellement la séparation entre les ingrédients automatiques
 * issus du planning et les ingrédients ajoutés manuellement.
 */

import { useMemo, useState } from "react";
import StoryPageWrapper from "../stories/StoryPageWrapper";

const initialItems = [
  {
    id: "auto-1-tomates",
    name: "Tomates",
    quantity: "2",
    unit: "",
    checked: false,
    source: "automatic",
  },
  {
    id: "auto-1-riz",
    name: "Riz",
    quantity: "200",
    unit: "g",
    checked: true,
    source: "automatic",
  },
  {
    id: "manual-1",
    name: "Bouteille d'eau",
    quantity: "1",
    unit: "",
    checked: false,
    source: "manual",
  },
];

/**
 * Affiche une version interactive simulée de la liste de courses.
 *
 * @returns {JSX.Element} Page de démonstration de la shopping list.
 */
function ShoppingListDemo() {
  const [items, setItems] = useState(initialItems);
  const [manualInput, setManualInput] = useState("");
  const [message, setMessage] = useState("");

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

  /**
   * Simule l'ajout d'un ingrédient manuel.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Événement de soumission.
   * @returns {void}
   */
  function handleAddManualItem(event) {
    event.preventDefault();

    const trimmed = manualInput.trim();

    if (!trimmed) {
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: `manual-${Date.now()}`,
        name: trimmed,
        quantity: "",
        unit: "",
        checked: false,
        source: "manual",
      },
    ]);

    setManualInput("");
    setMessage("Ingrédient ajouté à la liste.");
  }

  /**
   * Simule le changement d'état d'un ingrédient.
   *
   * @param {string} id Identifiant de l'item.
   * @param {boolean} checked Nouvel état.
   * @returns {void}
   */
  function handleToggle(id, checked) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, checked } : item))
    );
    setMessage("");
  }

  /**
   * Simule la suppression ou le masquage d'un ingrédient.
   *
   * @param {string} id Identifiant de l'item.
   * @returns {void}
   */
  function handleDelete(id) {
    setItems((current) => current.filter((item) => item.id !== id));
    setMessage("Ingrédient supprimé de la liste.");
  }

  /**
   * Rend une liste d'ingrédients.
   *
   * @param {Object[]} list Liste des items à afficher.
   * @returns {JSX.Element[]} Lignes d'ingrédients.
   */
  function renderItems(list) {
    return list.map((item) => (
      <div className="shopping-item-row" key={item.id}>
        <label className="shopping-item-left">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(event) => handleToggle(item.id, event.target.checked)}
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
            onClick={() => handleDelete(item.id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    ));
  }

  return (
    <StoryPageWrapper
      title="Liste de courses"
      subtitle="Gestion des ingrédients automatiques et manuels"
    >
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
          onChange={(event) => setManualInput(event.target.value)}
        />

        <button type="submit" className="primary-button">
          Ajouter
        </button>
      </form>

      {message ? <p className="success-message">{message}</p> : null}

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
              <p>Ce sont les ingrédients ajoutés par l’utilisateur.</p>
            </div>

            <span className="shopping-section-count">{manualItems.length}</span>
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
    </StoryPageWrapper>
  );
}

export default {
  title: "Pages/ShoppingList",
  tags: ["autodocs"],
};

export const Default = {
  render: () => <ShoppingListDemo />,
};