/**
 * @file RecipeDetail.jsx
 * @description Page détail d'une recette.
 * Charge une recette locale ou externe, affiche ses informations complètes,
 * permet son ajout au planning et, pour les recettes locales, sa modification
 * ou sa suppression.
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddToPlannerModal from "../components/AddToPlannerModal";
import { getRecipeById, deleteRecipe } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

/**
 * Transforme un texte d'instructions en liste d'étapes.
 *
 * @param {string} instructions Texte brut des instructions.
 * @returns {string[]} Tableau d'étapes nettoyées.
 */
function getInstructionSteps(instructions) {
  if (!instructions) return [];

  return instructions
    .split(/\r?\n|\./)
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

/**
 * Rend la page détail d'une recette locale ou externe.
 *
 * @returns {JSX.Element} Vue détaillée de la recette.
 */
export default function RecipeDetail() {
  const { source, id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecipe() {
      try {
        setLoading(true);
        setError("");

        const data = await getRecipeById(source, id);

        if (isMounted) {
          setRecipe(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Impossible de charger la recette."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRecipe();

    return () => {
      isMounted = false;
    };
  }, [source, id]);

  const steps = useMemo(() => {
    return getInstructionSteps(recipe?.instructions);
  }, [recipe]);

  /**
   * Supprime la recette locale courante après confirmation.
   *
   * @returns {Promise<void>} Promesse de suppression.
   */
  async function handleDelete() {
    if (!recipe || recipe.source !== "local") return;

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette recette ?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteRecipe(recipe.id);
      navigate("/recipes");
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de supprimer la recette."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page-container">
        <p className="error-message">Recette introuvable.</p>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="detail-hero">
        <Link to="/recipes" className="back-button">
          ←
        </Link>

        <img
          src={
            recipe.imageUrl ||
            "https://via.placeholder.com/1200x600?text=Meal+Planner"
          }
          alt={recipe.title}
          className="detail-hero-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://via.placeholder.com/1200x600?text=Meal+Planner";
          }}
        />
      </div>

      <div className="detail-card">
        <span className="badge">{recipe.category}</span>

        <h1>{recipe.title}</h1>

        <div className="detail-meta">
          <span>⏱ {recipe.prepTime || "—"}</span>
          <span>👥 {recipe.servings || 2} pers.</span>
          {recipe.source === "local" && <span>✨ Ma recette</span>}
        </div>

        <section className="detail-section">
          <h2>Ingrédients</h2>
          <ul className="ingredients-list">
            {(recipe.ingredients || []).map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-dot" />
                <span>
                  {[ingredient.quantity, ingredient.unit, ingredient.name]
                    .filter(Boolean)
                    .join(" ")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h2>Instructions</h2>
          <div className="steps-list">
            {steps.length > 0 ? (
              steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <div className="step-number">{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))
            ) : (
              <p>Aucune instruction disponible.</p>
            )}
          </div>
        </section>

        <div className="detail-actions">
          {isAuthenticated ? (
            <button
              type="button"
              className="primary-button full-button"
              onClick={() => setIsPlannerModalOpen(true)}
            >
              Ajouter au planning
            </button>
          ) : null}

          {isAuthenticated && recipe.source === "local" ? (
            <>
              <button
                type="button"
                className="secondary-button full-button"
                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
              >
                Modifier la recette
              </button>

              <button
                type="button"
                className="danger-button full-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer la recette"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <AddToPlannerModal
        recipe={recipe}
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}