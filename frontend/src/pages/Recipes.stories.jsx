/**
 * @file Recipes.stories.jsx
 * @description Stories Storybook de la page catalogue des recettes.
 * Simule une grille de recettes avec ou sans utilisateur connecté.
 */

import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import StoryPageWrapper from "../stories/StoryPageWrapper";

const recipes = [
  {
    id: "1",
    title: "Bol de fruits frais et granola",
    category: "Petit-déjeuner",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop",
    source: "external",
  },
  {
    id: "2",
    title: "Tartines avocat et oeuf",
    category: "Petit-déjeuner",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop",
    source: "external",
  },
  {
    id: "3",
    title: "Poulet roussi",
    category: "Chicken",
    imageUrl:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=1200&auto=format&fit=crop",
    source: "local",
  },
];

function renderRecipesPage(authValue) {
  return (
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          token: "",
          loading: false,
          login: async () => {},
          register: async () => {},
          logout: () => {},
          isAuthenticated: false,
          ...authValue,
        }}
      >
        <StoryPageWrapper
          title="Découvrez nos recettes"
          subtitle={
            authValue?.isAuthenticated
              ? "Retrouvez les recettes de notre collection et vos recettes personnelles"
              : "Explorez notre collection de recettes délicieuses et saines"
          }
        >
          {authValue?.isAuthenticated ? (
            <p className="welcome-text">Bienvenue Gregory 👋</p>
          ) : null}

          <div className="search-box">
            <input placeholder="Rechercher une recette..." />
          </div>

          <div className="filters-row">
            <button className="filter-chip active">Toutes</button>
            <button className="filter-chip">Petit-déjeuner</button>
            <button className="filter-chip">Déjeuner</button>
            <button className="filter-chip">Dîner</button>
          </div>

          {authValue?.isAuthenticated ? (
            <div style={{ marginBottom: 20 }}>
              <span className="primary-button inline-button">
                + Créer ma recette
              </span>
            </div>
          ) : null}

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={`${recipe.source}-${recipe.id}`} recipe={recipe} />
            ))}
          </div>
        </StoryPageWrapper>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

export default {
  title: "Pages/Recipes",
  tags: ["autodocs"],
};

export const LoggedOut = {
  render: () =>
    renderRecipesPage({
      isAuthenticated: false,
      user: null,
      token: "",
    }),
};

export const LoggedIn = {
  render: () =>
    renderRecipesPage({
      isAuthenticated: true,
      user: { firstname: "Gregory", name: "Gregory" },
      token: "fake-token",
    }),
};