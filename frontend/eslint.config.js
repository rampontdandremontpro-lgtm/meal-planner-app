/**
 * @file eslint.config.js
 * @description Configuration ESLint en format plat pour le frontend React.
 *
 * Ce fichier centralise les règles de qualité de code utilisées pendant le
 * développement. Il active :
 * - les règles JavaScript recommandées d'ESLint ;
 * - les bonnes pratiques liées aux Hooks React ;
 * - les règles de compatibilité avec React Fast Refresh et Vite ;
 * - les règles recommandées pour les fichiers Storybook.
 *
 * La configuration ignore également le dossier de build `dist` afin d'éviter
 * d'analyser des fichiers générés automatiquement.
 */

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Configuration ESLint exportée pour l'ensemble du projet frontend.
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  ...storybook.configs['flat/recommended'],
])
