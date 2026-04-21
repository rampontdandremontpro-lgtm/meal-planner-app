import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

export default function Recipes() {
  const { isAuthenticated, user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  useEffect(() => {
    fetchRecipes();
  }, [isAuthenticated]);

  async function fetchRecipes() {
    setLoading(true);
    setError("");

    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger les recettes."
      );
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const unique = [...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))];
    return ["Toutes", ...unique];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "Toutes" || recipe.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [recipes, search, selectedCategory]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Découvrez nos recettes</h1>

          {isAuthenticated ? (
            <>
              <p className="welcome-text">
                Bienvenue {user?.firstname || user?.name || "utilisateur"} 👋
              </p>
              <p>
                Retrouvez les recettes de notre collection et vos recettes personnelles
              </p>
            </>
          ) : (
            <p>Explorez notre collection de recettes</p>
          )}
        </div>

        {isAuthenticated && (
          <Link to="/recipes/new" className="primary-button inline-button">
            + Créer ma recette
          </Link>
        )}
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filters-row">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "filter-chip active"
                : "filter-chip"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p>Chargement des recettes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard key={`${recipe.source}-${recipe.id}`} recipe={recipe} />
            ))
          ) : (
            <p>Aucune recette trouvée.</p>
          )}
        </div>
      )}
    </div>
  );
}