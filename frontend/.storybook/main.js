/**
 * @file main.js
 * @description Configuration principale de Storybook pour le frontend React.
 * Charge uniquement les stories du projet et ignore les stories d'exemple
 * générées automatiquement par Storybook.
 */

export default {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "!../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};