import { useEffect, useState } from "react";
import { createMealPlan } from "../services/plannerService";

const mealTypes = [
  { value: "breakfast", label: "Petit-déjeuner" },
  { value: "lunch", label: "Déjeuner" },
  { value: "dinner", label: "Dîner" },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AddToPlannerModal({
  recipe,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [date, setDate] = useState(getTodayDate());
  const [mealType, setMealType] = useState("lunch");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(getTodayDate());
      setMealType("lunch");
      setMessage("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await createMealPlan({
        recipeId: recipe.id,
        date,
        mealType,
      });

      setMessage("Recette ajoutée au planning.");
      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible d’ajouter la recette au planning."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Ajouter au planning</h3>
          <button className="icon-button" onClick={onClose}>
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
              {mealTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

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