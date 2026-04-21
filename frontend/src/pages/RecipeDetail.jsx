import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddToPlannerModal from "../components/AddToPlannerModal";
import { deleteRecipe, getRecipeById } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

function getInstructionSteps(instructions) {
  if (!instructions) return [];

  return instructions
    .split(/\r?\n|\./)
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

export default function RecipeDetail() {
  const { source, id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [source, id]);

  async function fetchRecipe() {
    setLoading(true);
    setError("");

    try {
      const data = await getRecipeById(source, id);
      setRecipe(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger la recette."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette recette ?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
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

  const steps = useMemo(() => {
    return getInstructionSteps(recipe?.instructions);
  }, [recipe]);

  const isLocalRecipe = recipe?.source === "local";
  const canEditRecipe = isAuthenticated && isLocalRecipe;
  const canDeleteRecipe = isAuthenticated && isLocalRecipe;

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
        <p>Recette introuvable.</p>
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
          src={recipe.image}
          alt={recipe.title}
          className="detail-hero-image"
        />
      </div>

      <div className="detail-card">
        <span className="badge">{recipe.category}</span>

        <h1>{recipe.title}</h1>

        <div className="detail-meta">
          <span>⏱ {recipe.prepTime || "—"}</span>
          <span>👥 {recipe.servings} pers.</span>
          {recipe.source === "local" && <span>✨ Ma recette</span>}
        </div>

        <section className="detail-section">
          <h2>Ingrédients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-dot" />
                <span>
                  {ingredient.quantity ? `${ingredient.quantity} ` : ""}
                  {ingredient.name}
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
          <button
            className="primary-button full-button"
            onClick={() => setIsPlannerModalOpen(true)}
          >
            Ajouter au planning
          </button>

          {canEditRecipe && (
            <button
              className="secondary-button full-button"
              onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
            >
              Modifier la recette
            </button>
          )}

          {canDeleteRecipe && (
            <button
              className="danger-button full-button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer la recette"}
            </button>
          )}
        </div>
      </div>

      <AddToPlannerModal
        recipe={recipe}
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
      />
    </div>
  );
}