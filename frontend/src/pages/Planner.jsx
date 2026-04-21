import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteMealPlan, getWeekMealPlans } from "../services/plannerService";

const mealTypes = [
  { key: "BREAKFAST", label: "Petit-déjeuner", className: "planner-breakfast" },
  { key: "LUNCH", label: "Déjeuner", className: "planner-lunch" },
  { key: "DINNER", label: "Dîner", className: "planner-dinner" },
];

const dayNames = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDateForApi(date) {
  return date.toISOString().split("T")[0];
}

function formatDay(date) {
  return `${dayNames[(date.getDay() + 6) % 7]}`;
}

function buildWeekDays(startDate) {
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }

  return days;
}

function normalizeMealType(value) {
  if (!value) return "";
  return String(value).toUpperCase();
}

function normalizeDate(value) {
  if (!value) return "";
  const str = String(value);
  return str.includes("T") ? str.split("T")[0] : str;
}

function normalizeMealPlan(item) {
  return {
    id: item.id,
    date: normalizeDate(item.date),
    mealType: normalizeMealType(item.mealType),
    source: item.source || item.recipe?.source || "external",
    recipe: {
      id: item.recipe?.id,
      source: item.recipe?.source || item.source || "external",
      title: item.recipe?.title || "Recette",
      image: item.recipe?.image || item.recipe?.imageUrl || "",
    },
  };
}

export default function Planner() {
  const navigate = useNavigate();

  const [currentMonday, setCurrentMonday] = useState(getMonday());
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const weekDays = useMemo(() => buildWeekDays(currentMonday), [currentMonday]);

  useEffect(() => {
    fetchWeekPlans();
  }, [currentMonday]);

  async function fetchWeekPlans() {
    setLoading(true);
    setError("");

    try {
      const data = await getWeekMealPlans(formatDateForApi(currentMonday));
      const normalized = data.map(normalizeMealPlan);
      setMealPlans(normalized);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger le planning."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(mealPlanId) {
    try {
      setDeletingId(mealPlanId);
      await deleteMealPlan(mealPlanId);
      setMealPlans((prev) => prev.filter((item) => item.id !== mealPlanId));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Impossible de retirer cette recette du planning."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function previousWeek() {
    const newDate = new Date(currentMonday);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentMonday(newDate);
  }

  function nextWeek() {
    const newDate = new Date(currentMonday);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentMonday(newDate);
  }

  function getMealForCell(date, mealType) {
    const formatted = formatDateForApi(date);

    return mealPlans.find(
      (item) => item.date === formatted && item.mealType === mealType
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Planning des repas</h1>
          <p>Organisez vos repas de la semaine</p>
        </div>
      </div>

      <div className="week-nav-card">
        <button className="icon-button" onClick={previousWeek}>
          ←
        </button>
        <h2>Semaine du {formatDateForApi(currentMonday)}</h2>
        <button className="icon-button" onClick={nextWeek}>
          →
        </button>
      </div>

      {loading && <p>Chargement du planning...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="planner-table">
          <div className="planner-header-row">
            <div className="planner-side-label empty-cell" />
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="planner-day-header">
                {formatDay(day)}
              </div>
            ))}
          </div>

          {mealTypes.map((meal) => (
            <div key={meal.key} className="planner-row">
              <div className="planner-side-label">{meal.label}</div>

              {weekDays.map((day) => {
                const mealItem = getMealForCell(day, meal.key);

                return (
                  <div
                    key={`${meal.key}-${day.toISOString()}`}
                    className={`planner-cell ${meal.className}`}
                  >
                    {mealItem ? (
                      <div className="planner-filled-card">
                        {mealItem.recipe?.image ? (
                          <Link
                            to={`/recipes/${mealItem.recipe?.source || "external"}/${mealItem.recipe?.id}`}
                          >
                            <img
                              src={mealItem.recipe.image}
                              alt={mealItem.recipe.title}
                              className="planner-filled-image"
                            />
                          </Link>
                        ) : null}

                        <Link
                          to={`/recipes/${mealItem.recipe?.source || "external"}/${mealItem.recipe?.id}`}
                          className="planner-filled-title"
                        >
                          {mealItem.recipe?.title}
                        </Link>

                        <button
                          type="button"
                          className="planner-remove-button"
                          onClick={() => handleRemove(mealItem.id)}
                          disabled={deletingId === mealItem.id}
                        >
                          {deletingId === mealItem.id ? "Retrait..." : "Retirer"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="planner-add-button"
                        onClick={() => navigate("/recipes")}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}