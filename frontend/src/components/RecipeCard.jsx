import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="recipe-card-image"
      />

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>

        <div className="recipe-meta-row">
          <span className="badge">{recipe.category}</span>
          {recipe.source === "custom" && (
            <span className="badge badge-outline">Ma recette</span>
          )}
        </div>
      </div>
    </Link>
  );
}