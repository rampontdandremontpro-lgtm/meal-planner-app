/// <reference types="vitest/config" />
/**
 * @file vite.config.js
 * @description Configuration principale de Vite et de l'environnement de test.
 *
 * Ce fichier :
 * - active le plugin React pour Vite ;
 * - déclare la configuration Vitest ;
 * - branche les tests Storybook via l'addon Vitest ;
 * - exécute les tests de stories dans un navigateur Chromium headless grâce à Playwright.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

/**
 * Résout le répertoire courant du fichier de configuration, y compris lorsque
 * le projet fonctionne en mode ESM où `__dirname` n'est pas disponible par défaut.
 *
 * @type {string}
 */
const dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

/**
 * Configuration Vite exportée pour le frontend et les tests Storybook.
 *
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
