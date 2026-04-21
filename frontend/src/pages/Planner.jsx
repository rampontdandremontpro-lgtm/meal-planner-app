import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const MEAL_TYPES = [
  { key: "BREAKFAST", label: "Petit-déjeuner", className: "planner-breakfast" },
  { key: "LUNCH", label: "Déjeuner", className: "planner-lunch" },
  { key: "DINNER", label: "Dîner", className: "planner-dinner" },
];

function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFrenchDayShort(date) {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return days[date.getDay()];
}

export default function Planner() {
  const navigate = useNavigate();

  const [currentMonday, setCurrentMonday] = useState(() => getMonday());
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => addDays(currentMonday, index));
  }, [currentMonday]);

  async function loadMealPlans() {
    try {
      setLoading(true);
      setErrorMessage("");

      const mondayString = formatDateLocal(currentMonday);

      const response = await api.get("/meal-plans/week", {
        params: { date: mondayString },
      });

      setMealPlans(response.data?.items || []);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message || "Impossible de charger le planning.";

      setErrorMessage(
        Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage
      );
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMealPlans();
  }, [currentMonday]);

  async function handleRemoveMealPlan(id) {
    try {
      setRemovingId(id);
      setErrorMessage("");

      await api.delete(`/meal-plans/${id}`);
      await loadMealPlans();
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Impossible de retirer cette recette du planning.";

      setErrorMessage(
        Array.isArray(backendMessage) ? backendMessage.join(", ") : backendMessage
      );
    } finally {
      setRemovingId(null);
    }
  }

  function getMealForCell(dateString, mealType) {
    return mealPlans.find(
      (item) => item.date === dateString && item.mealType === mealType
    );
  }

  function handleAddClick(dateString, mealType) {
    navigate("/recipes", {
      state: {
        plannerPrefill: {
          date: dateString,
          mealType,
        },
      },
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Planning des repas</h1>
          <p>Organisez vos repas de la semaine</p>
        </div>
      </div>

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <div className="week-nav-card">
        <button
          type="button"
          className="icon-button"
          onClick={() => setCurrentMonday((prev) => addDays(prev, -7))}
        >
          ←
        </button>

        <h2>Semaine du {formatDateLocal(currentMonday)}</h2>

        <button
          type="button"
          className="icon-button"
          onClick={() => setCurrentMonday((prev) => addDays(prev, 7))}
        >
          →
        </button>
      </div>

      {loading ? (
        <div className="placeholder-card">
          <p>Chargement du planning...</p>
        </div>
      ) : (
        <div className="planner-table">
          <div className="planner-header-row">
            <div className="empty-cell" />
            {weekDates.map((date) => (
              <div key={formatDateLocal(date)} className="planner-day-header">
                {getFrenchDayShort(date)} {date.getDate()}
              </div>
            ))}
          </div>

          {MEAL_TYPES.map((mealType) => (
            <div className="planner-row" key={mealType.key}>
              <div className="planner-side-label">{mealType.label}</div>

              {weekDates.map((date) => {
                const dateString = formatDateLocal(date);
                const meal = getMealForCell(dateString, mealType.key);

                return (
                  <div
                    key={`${mealType.key}-${dateString}`}
                    className={`planner-cell ${mealType.className}`}
                  >
                    {!meal ? (
                      <button
                        type="button"
                        className="planner-add-button"
                        onClick={() => handleAddClick(dateString, mealType.key)}
                      >
                        +
                      </button>
                    ) : (
                      <div className="planner-filled-card">
                        <img
                          className="planner-filled-image"
                          src={
                            meal.recipe?.imageUrl ||
                            "https://via.placeholder.com/400x300?text=Meal+Planner"
                          }
                          alt={meal.recipe?.title || "Recette"}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300?text=Meal+Planner";
                          }}
                        />

                        <div className="planner-filled-title">
                          {meal.recipe?.title || "Recette"}
                        </div>

                        <button
                          type="button"
                          className="planner-remove-button"
                          onClick={() => handleRemoveMealPlan(meal.id)}
                          disabled={removingId === meal.id}
                        >
                          {removingId === meal.id ? "Retrait..." : "Retirer"}
                        </button>
                      </div>
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