/**
 * @file AddToPlannerModel.stories.jsx
 * @description Stories Storybook du composant AddToPlannerModal.
 * Fournit un environnement isolé pour visualiser la modale avec une recette
 * de démonstration et un état d'ouverture local.
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
 * Démo interactive de la modale dans Storybook.
 *
 * @param {Object} args Arguments Storybook transmis au composant.
 * @returns {JSX.Element} Rendu de démonstration.
 */
function ModalDemo(args) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <StoryPageWrapper title="Modal ajout au planning" subtitle="Prévisualisation du composant">
      <AddToPlannerModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {}}
      />
    </StoryPageWrapper>
  );
}

export const Default = {
  render: (args) => <ModalDemo {...args} />,
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