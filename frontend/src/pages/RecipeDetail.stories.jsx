/**
 * @file RecipeDetail.stories.jsx
 * @description Stories Storybook de la page détail d'une recette.
 * Permet de visualiser un écran détail réaliste sans dépendre du backend.
 */

import StoryPageWrapper from "../stories/StoryPageWrapper";

export default {
  title: "Pages/RecipeDetail",
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <div className="recipe-detail-page">
      <div className="detail-hero">
        <img
          className="detail-hero-image"
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop"
          alt="Bol de fruits frais et granola"
        />
        <button className="back-button">←</button>
      </div>

      <div className="detail-card">
        <span className="badge">Petit-déjeuner</span>

        <h1>Bol de fruits frais et granola</h1>

        <div className="detail-meta">
          <span>⏱ 10 min</span>
          <span>👥 2 pers.</span>
        </div>

        <section className="detail-section">
          <h2>Ingrédients</h2>
          <ul className="ingredients-list">
            <li><span className="ingredient-dot" />200g de yaourt grec</li>
            <li><span className="ingredient-dot" />100g de granola maison</li>
            <li><span className="ingredient-dot" />1 banane</li>
            <li><span className="ingredient-dot" />150g de myrtilles</li>
          </ul>
        </section>

        <section className="detail-section">
          <h2>Instructions</h2>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <p>Déposer le yaourt dans deux bols.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <p>Ajouter les fruits frais puis le granola.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <p>Servir immédiatement.</p>
            </div>
          </div>
        </section>

        <div className="detail-actions">
          <button className="primary-button full-button">Ajouter au planning</button>
          <button className="secondary-button full-button">Modifier la recette</button>
          <button className="danger-button full-button">Supprimer la recette</button>
        </div>
      </div>
    </div>
  ),
};