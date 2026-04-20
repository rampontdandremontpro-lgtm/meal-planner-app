import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWeekMealPlans } from "../services/plannerService";

const mealTypes = [
  { key: "breakfast", label: "Petit-déjeuner" },
  { key: "lunch", label: "Déjeuner" },
  { key: "dinner", label: "Dîner" },
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
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateForApi(date) {
  return date.toISOString().split("T")[0];
}

function formatDay(date) {
  return `${dayNames[(date.getDay() + 6) % 7]} ${date.getDate()}`;
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

function normalizeMealPlan(item) {
  return {
    id: item.id,
    date: item.date || item.plannedDate || item.day || item.mealDate,
    mealType: item.mealType,
    recipe: item.recipe || {
      id: item.recipeId,
      title: item.recipeTitle || item.title || "Recette",
      image: item.recipeImage || item.image || "",
    },
  };
}

export default function Planner() {
  const [currentMonday, setCurrentMonday] = useState(getMonday());
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weekDays = useMemo(() => buildWeekDays(currentMonday), [currentMonday]);

  useEffect(() => {
    fetchWeekPlans();
  }, [currentMonday]);

  async function fetchWeekPlans() {
    setLoading(true);
    setError("");

    try {
      const data = await getWeekMealPlans(formatDateForApi(currentMonday));
      setMealPlans(data.map(normalizeMealPlan));
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger le planning."
      );
    } finally {
      setLoading(false);
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
                  <div key={`${meal.key}-${day.toISOString()}`} className="planner-cell">
                    {mealItem ? (
                      <Link
                        to={`/recipes/${mealItem.recipe?.id}`}
                        className="planner-meal-card"
                      >
                        {mealItem.recipe?.image ? (
                          <img
                            src={mealItem.recipe.image}
                            alt={mealItem.recipe.title}
                          />
                        ) : null}
                        <span>{mealItem.recipe?.title}</span>
                      </Link>
                    ) : (
                      <div className="planner-empty">+</div>
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