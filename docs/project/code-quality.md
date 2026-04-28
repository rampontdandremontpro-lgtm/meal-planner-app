# Code Quality

Ce document présente les outils utilisés pour vérifier la qualité du code du projet **Meal Planner**.

---

## Backend

### Outil utilisé

Pour le backend, nous avons utilisé **ESLint**.

ESLint permet de vérifier la qualité du code TypeScript, de repérer certaines erreurs et d’homogénéiser le style du code.

### Commandes utilisées

```bash
cd backend
npm run lint
npm run build
```

### Objectifs

- Vérifier la qualité du code TypeScript
- Détecter les erreurs de syntaxe
- Garder un code propre et homogène
- Vérifier que le backend compile correctement

### Résultat attendu

Le backend doit compiler sans erreur après le passage du linter.

---

## Frontend

### Outils utilisés

Pour le frontend, nous avons utilisé :

- **ESLint** pour vérifier la qualité du code
- **Vitest** pour les tests simples
- **Storybook** pour tester visuellement les composants
- **Vite build** pour vérifier que l’application compile correctement

### Commandes utilisées

```bash
cd frontend
npm run lint
npm run test:run
npm run build
npm run build-storybook
```

### Objectifs

- Vérifier la qualité du code React
- Tester quelques comportements simples
- Vérifier les composants visuellement avec Storybook
- S’assurer que le frontend compile correctement

---

## Tests frontend

Les tests frontend vérifient notamment :

- le format d’une date
- le calcul du nombre d’ingrédients cochés
- la séparation des ingrédients automatiques et manuels

Ces tests permettent de valider une partie de la logique utilisée dans la liste de courses.

---

## Storybook

Storybook est utilisé pour visualiser certains composants ou écrans du frontend sans lancer toute l’application.

Il permet de vérifier :

- l’affichage des composants
- la cohérence du design
- les états visuels importants

---

## Conclusion

Pour la qualité du code, nous avons utilisé une combinaison de plusieurs outils :

- ESLint pour le backend et le frontend
- Vitest pour les tests frontend
- Storybook pour les tests visuels
- Build backend/frontend pour vérifier la compilation

Ces vérifications permettent de limiter les erreurs et de s’assurer que le projet reste stable avant le rendu.
