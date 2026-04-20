import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipeService";

export default function AddRecipe() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
    prepTime: "",
    servings: "",
    instructions: "",
  });

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleIngredientChange(index, field, value) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }

  function addIngredientRow() {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  }

  function removeIngredientRow(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanedIngredients = ingredients.filter(
      (item) => item.name.trim() !== ""
    );

    try {
      await createRecipe({
        title: form.title,
        category: form.category,
        imageUrl: form.imageUrl,
        prepTime: Number(form.prepTime) || 10,
        servings: Number(form.servings) || 2,
        instructions: form.instructions,
        ingredients: cleanedIngredients,
      });

      navigate("/recipes");
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de créer la recette."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="form-page-card">
        <h1>Créer ma recette</h1>
        <p>Ajoute une recette personnalisée avec tes propres ingrédients</p>

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-grid">
            <label>
              Titre
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Catégorie
              <input
                type="text"
                name="category"
                placeholder="Petit-déjeuner, Déjeuner, Dîner..."
                value={form.category}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Image URL
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </label>

            <label>
              Temps de préparation
              <input
                type="number"
                name="prepTime"
                value={form.prepTime}
                onChange={handleChange}
              />
            </label>

            <label>
              Nombre de personnes
              <input
                type="number"
                name="servings"
                value={form.servings}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Instructions
            <textarea
              name="instructions"
              rows="6"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Une étape par ligne ou en texte libre..."
              required
            />
          </label>

          <div className="ingredients-form-block">
            <div className="ingredients-form-header">
              <h2>Ingrédients</h2>
              <button
                type="button"
                className="secondary-button"
                onClick={addIngredientRow}
              >
                + Ajouter un ingrédient
              </button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div className="ingredient-row" key={index}>
                <input
                  type="text"
                  placeholder="Nom de l’ingrédient"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Quantité"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeIngredientRow(index)}
                  disabled={ingredients.length === 1}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/recipes")}
            >
              Annuler
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Création..." : "Créer la recette"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}