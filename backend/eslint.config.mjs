// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      /**
       * On garde no-explicit-any désactivé car certaines parties du projet
       * utilisent des réponses externes non typées, notamment TheMealDB,
       * Passport et NestJS.
       */
      '@typescript-eslint/no-explicit-any': 'off',

      /**
       * Ces règles sont trop strictes pour ce projet étudiant car plusieurs
       * librairies externes renvoient des données typées en any.
       * Le projet reste sécurisé grâce aux DTO, ValidationPipe et tests manuels.
       */
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      /**
       * Certaines méthodes NestJS peuvent rester async même sans await
       * pour respecter les signatures attendues par Passport ou Nest.
       */
      '@typescript-eslint/require-await': 'off',

      /**
       * On garde cette règle en warning pour signaler les promesses non attendues
       * sans bloquer le lint.
       */
      '@typescript-eslint/no-floating-promises': 'warn',

      /**
       * Configuration Prettier compatible Windows.
       */
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);