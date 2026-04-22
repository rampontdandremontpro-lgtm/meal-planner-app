/**
 * @file EditRecipe.jsx
 * @description Page d'édition d'une recette locale existante.
 * Charge la recette ciblée, pré-remplit le formulaire puis envoie les
 * modifications à l'API.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../services/recipeService";

/**
 * Rend la page de modification d'une recette locale.
 *
 * @returns {JSX.Element} Formulaire d'édition pré-rempli.
 */
export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
    prepTime: "",
    servings: "",
    instructions: "",
  });

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  /**
   * Charge la recette locale à modifier.
   *
   * @returns {Promise<void>} Promesse de récupération des données.
   */
  async function fetchRecipe() {
    setLoadingRecipe(true);
    setError("");

    try {
      const recipe = await getRecipeById("local", id);

      setForm({
        title: recipe.title || "",
        category: recipe.category || "",
        imageUrl: recipe.image || "",
        prepTime: recipe.prepTime || "",
        servings: recipe.servings || "",
        instructions: recipe.instructions || "",
      });

      setIngredients(
        recipe.ingredients?.length
          ? recipe.ingredients.map((item) => ({
              name: item.name || "",
              quantity:
                item.quantity && item.unit
                  ? `${item.quantity} ${item.unit}`.trim()
                  : item.quantity || "",
            }))
          : [{ name: "", quantity: "" }]
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger la recette."
      );
    } finally {
      setLoadingRecipe(false);
    }
  }

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
   * Met à jour un ingrédient existant.
   *
   * @param {number} index Index de la ligne.
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
   * Supprime une ligne d'ingrédient.
   *
   * @param {number} index Index à supprimer.
   * @returns {void}
   */
  function removeIngredientRow(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  /**
   * Enregistre les modifications de la recette.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Événement de soumission.
   * @returns {Promise<void>} Promesse de mise à jour.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingSubmit(true);
    setError("");

    const cleanedIngredients = ingredients.filter(
      (item) => item.name.trim() !== ""
    );

    try {
      await updateRecipe(id, {
        title: form.title,
        category: form.category,
        imageUrl: form.imageUrl,
        prepTime: form.prepTime ? String(form.prepTime) : "10 min",
        servings: Number(form.servings) || 2,
        instructions: form.instructions,
        ingredients: cleanedIngredients,
      });

      navigate(`/recipes/local/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de modifier la recette."
      );
    } finally {
      setLoadingSubmit(false);
    }
  }

  if (loadingRecipe) {
    return (
      <div className="page-container">
        <p>Chargement de la recette...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-page-card">
        <h1>Modifier ma recette</h1>
        <p>Modifie les informations de ta recette personnalisée</p>

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
                name="prepTime"
                placeholder="Ex: 10 min"
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
              onClick={() => navigate(`/recipes/local/${id}`)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Modification..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}