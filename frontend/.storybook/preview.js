/**
 * @file preview.js
 * @description Configuration globale de rendu des stories.
 * Importe les fichiers CSS principaux de l'application afin que Storybook
 * conserve le même design que le frontend.
 */

import "../src/index.css";
import "../src/App.css";

const preview = {
  parameters: {
    layout: "padded",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;