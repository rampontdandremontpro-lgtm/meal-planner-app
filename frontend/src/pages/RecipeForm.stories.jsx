/**
 * @file RecipeForms.stories.jsx
 * @description Stories Storybook des formulaires de création et modification
 * de recette. Ces stories sont statiques afin d'éviter les appels API.
 */

import StoryPageWrapper from "../stories/StoryPageWrapper";

/**
 * Formulaire visuel partagé pour créer ou modifier une recette.
 *
 * @param {Object} props Propriétés du composant.
 * @param {string} props.title Titre du formulaire.
 * @param {string} props.subtitle Sous-titre du formulaire.
 * @param {string} props.buttonLabel Libellé du bouton principal.
 * @param {boolean} [props.prefilled] Indique si les champs sont pré-remplis.
 * @returns {JSX.Element} Formulaire de recette.
 */
function RecipeFormDemo({ title, subtitle, buttonLabel, prefilled = false }) {
  return (
    <StoryPageWrapper title={title} subtitle={subtitle}>
      <div className="form-page-card">
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <form className="recipe-form">
          <div className="form-grid">
            <label>
              Titre
              <input
                type="text"
                defaultValue={prefilled ? "Poulet roussi" : ""}
                placeholder="Ex: Poulet roussi"
              />
            </label>

            <label>
              Catégorie
              <input
                type="text"
                defaultValue={prefilled ? "Déjeuner" : ""}
                placeholder="Petit-déjeuner, Déjeuner, Dîner..."
              />
            </label>

            <label>
              Image URL
              <input
                type="text"
                defaultValue={
                  prefilled
                    ? "https://images.unsplash.com/photo-1518492104633-130d0cc84637"
                    : ""
                }
                placeholder="https://..."
              />
            </label>

            <label>
              Temps de préparation
              <input
                type="text"
                defaultValue={prefilled ? "30 min" : ""}
                placeholder="Ex: 10 min ou 1h30"
              />
            </label>

            <label>
              Nombre de personnes
              <input
                type="number"
                defaultValue={prefilled ? "2" : ""}
                placeholder="2"
              />
            </label>
          </div>

          <label>
            Instructions
            <textarea
              defaultValue={
                prefilled
                  ? "Faire revenir le poulet avec les épices, puis laisser mijoter."
                  : ""
              }
              placeholder="Décris les étapes de préparation..."
            />
          </label>

          <div className="ingredients-editor">
            <div className="ingredients-header">
              <h2>Ingrédients</h2>
              <button type="button" className="secondary-button">
                + Ajouter un ingrédient
              </button>
            </div>

            <div className="ingredient-row">
              <input
                type="text"
                defaultValue={prefilled ? "Poulet" : ""}
                placeholder="Nom de l'ingrédient"
              />
              <input
                type="text"
                defaultValue={prefilled ? "2 morceaux" : ""}
                placeholder="Quantité"
              />
              <button type="button" className="danger-button">
                Supprimer
              </button>
            </div>

            <div className="ingredient-row">
              <input
                type="text"
                defaultValue={prefilled ? "Tomates" : ""}
                placeholder="Nom de l'ingrédient"
              />
              <input
                type="text"
                defaultValue={prefilled ? "2" : ""}
                placeholder="Quantité"
              />
              <button type="button" className="danger-button">
                Supprimer
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button">
              Annuler
            </button>
            <button type="button" className="primary-button">
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </StoryPageWrapper>
  );
}

export default {
  title: "Pages/RecipeForms",
  tags: ["autodocs"],
};

export const CreateRecipe = {
  render: () => (
    <RecipeFormDemo
      title="Créer ma recette"
      subtitle="Ajoute une recette personnalisée avec tes propres ingrédients"
      buttonLabel="Créer la recette"
    />
  ),
};

export const EditRecipe = {
  render: () => (
    <RecipeFormDemo
      title="Modifier ma recette"
      subtitle="Modifie les informations de ta recette personnalisée"
      buttonLabel="Enregistrer"
      prefilled
    />
  ),
};