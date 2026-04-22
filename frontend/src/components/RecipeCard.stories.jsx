/**
 * @file RecipeCard.stories.jsx
 * @description Stories Storybook du composant RecipeCard.
 * Permet de vérifier l'affichage de cartes de recettes locales ou externes.
 */

import { MemoryRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import StoryPageWrapper from "../stories/StoryPageWrapper";

export default {
  title: "Components/RecipeCard",
  component: RecipeCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <StoryPageWrapper
          title="Cards recettes"
          subtitle="Prévisualisation des variantes"
        >
          <div style={{ maxWidth: 360 }}>
            <Story />
          </div>
        </StoryPageWrapper>
      </MemoryRouter>
    ),
  ],
};

export const ExternalRecipe = {
  args: {
    recipe: {
      id: "52940",
      title: "Brown Stew Chicken",
      category: "Chicken",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg",
      source: "external",
    },
  },
};

export const LocalRecipe = {
  args: {
    recipe: {
      id: "12",
      title: "Poulet roussi",
      category: "Chicken",
      imageUrl:
        "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=1200&auto=format&fit=crop",
      source: "local",
    },
  },
};

export const BrokenImageFallback = {
  args: {
    recipe: {
      id: "99",
      title: "Recette sans image valide",
      category: "Rapide",
      imageUrl: "https://image-inexistante-test-meal-planner.jpg",
      source: "local",
    },
  },
};