import { useEffect, useState } from "react";
import { createMealPlan } from "../services/plannerService";

const mealTypeOptions = [
  { value: "BREAKFAST", label: "Petit-déjeuner" },
  { value: "LUNCH", label: "Déjeuner" },
  { value: "DINNER", label: "Dîner" },
];

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddToPlannerModal({
  recipe,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [date, setDate] = useState(getTodayDate());
  const [mealType, setMealType] = useState("LUNCH");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(getTodayDate());
      setMealType("LUNCH");
      setMessage("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen || !recipe) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const normalizedSource =
        recipe.source === "external" ? "external" : "local";

      const payload = {
        date,
        mealType,
        source: normalizedSource,
        ...(normalizedSource === "external"
          ? { externalRecipeId: String(recipe.id) }
          : { recipeId: Number(recipe.id) }),
      };

      await createMealPlan(payload);

      setMessage("Recette ajoutée au planning.");
      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      const backendMessage = err.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(" "));
      } else {
        setError(
          backendMessage || "Impossible d’ajouter la recette au planning."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Ajouter au planning</h3>
          <button type="button" className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="muted-text">{recipe.title}</p>

        <form onSubmit={handleSubmit} className="planner-form">
          <label>
            Jour
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label>
            Type de repas
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              {mealTypeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {message ? <p className="success-message">{message}</p> : null}
          {error ? <p className="error-message">{error}</p> : null}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Ajout..." : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}