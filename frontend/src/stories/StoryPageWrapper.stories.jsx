/**
 * @file StoryPageWrapper.stories.jsx
 * @description Story Storybook du conteneur StoryPageWrapper.
 */

import StoryPageWrapper from "./StoryPageWrapper";

export default {
  title: "Foundations/StoryPageWrapper",
  component: StoryPageWrapper,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Titre de page",
    subtitle: "Sous-titre de démonstration",
    children: (
      <div className="placeholder-card">
        <p>Contenu de démonstration</p>
      </div>
    ),
  },
};