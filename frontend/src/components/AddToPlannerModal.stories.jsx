/**
 * @file AddToPlannerModal.stories.jsx
 * @description Stories Storybook du composant AddToPlannerModal.
 * Permet de visualiser la modale d'ajout au planning avec une recette locale
 * et une recette externe.
 */

import { useState } from "react";
import AddToPlannerModal from "./AddToPlannerModal";
import StoryPageWrapper from "../stories/StoryPageWrapper";

export default {
  title: "Components/AddToPlannerModal",
  component: AddToPlannerModal,
  tags: ["autodocs"],
};

/**
 * Affiche la modale dans un état ouvert contrôlé par Storybook.
 *
 * @param {Object} args Arguments de la story.
 * @returns {JSX.Element} Démonstration interactive de la modale.
 */
function ModalDemo(args) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <StoryPageWrapper
      title="Modale ajout au planning"
      subtitle="Prévisualisation du composant utilisé depuis le détail d'une recette"
    >
      {!isOpen ? (
        <button
          type="button"
          className="primary-button"
          onClick={() => setIsOpen(true)}
        >
          Rouvrir la modale
        </button>
      ) : null}

      <AddToPlannerModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {}}
      />
    </StoryPageWrapper>
  );
}

export const LocalRecipe = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    recipe: {
      id: "1",
      title: "Poulet roussi",
      category: "Chicken",
      imageUrl:
        "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=1200&auto=format&fit=crop",
      source: "local",
    },
  },
};

export const ExternalRecipe = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    recipe: {
      id: "52772",
      title: "Teriyaki Chicken Casserole",
      category: "Chicken",
      imageUrl:
        "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      source: "external",
    },
  },
};