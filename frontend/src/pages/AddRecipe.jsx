/**
 * @file AddRecipe.jsx
 * @description Page de création d'une recette personnalisée.
 * Gère le formulaire principal, la liste dynamique des ingrédients et
 * l'envoi des données au backend avant redirection.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipeService";

/**
 * Rend la page de création d'une recette locale.
 *
 * @returns {JSX.Element} Formulaire complet de création.
 */
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

  /**
   * Met à jour un champ simple du formulaire.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e Événement de saisie.
   * @returns {void}
   */
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Met à jour un ingrédient dans la liste dynamique.
   *
   * @param {number} index Position de l'ingrédient.
   * @param {string} field Champ ciblé.
   * @param {string} value Nouvelle valeur.
   * @returns {void}
   */
  function handleIngredientChange(index, field, value) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }

  /**
   * Ajoute une ligne d'ingrédient vide.
   *
   * @returns {void}
   */
  function addIngredientRow() {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  }

  /**
   * Supprime une ligne d'ingrédient par son index.
   *
   * @param {number} index Position à supprimer.
   * @returns {void}
   */
  function removeIngredientRow(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  /**
   * Soumet la nouvelle recette au backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Événement de soumission.
   * @returns {Promise<void>} Promesse de création.
   */
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
  prepTime: form.prepTime ? String(form.prepTime) : "20",
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
              type="text"
              placeholder="Ex: 10 min ou 1h30"
              value={form.prepTime}
              onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
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