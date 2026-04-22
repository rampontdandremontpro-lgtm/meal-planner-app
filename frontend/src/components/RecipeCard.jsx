/**
 * @file RecipeCard.jsx
 * @description Carte d'affichage d'une recette dans une grille.
 * Présente l'image, le titre, la catégorie et l'origine de la recette,
 * puis redirige vers la page détail au clic.
 */

import { Link } from "react-router-dom";

/**
 * Affiche une carte résumée d'une recette.
 *
 * @param {Object} props Propriétés du composant.
 * @param {Object} props.recipe Recette à afficher.
 * @returns {JSX.Element} Carte cliquable redirigeant vers le détail.
 */
export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.source}/${recipe.id}`} className="recipe-card">
      <img
        className="recipe-card-image"
        src={recipe.imageUrl || "https://via.placeholder.com/400x300?text=Meal+Planner"}
        alt={recipe.title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://via.placeholder.com/400x300?text=Meal+Planner";
        }}
      />

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>

        <div className="recipe-meta-row">
          <span className="badge">{recipe.category}</span>

          {recipe.source === "local" && (
            <span className="badge badge-outline">Ma recette</span>
          )}
        </div>
      </div>
    </Link>
  );
}