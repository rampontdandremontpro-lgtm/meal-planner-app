# Testing

Ce document présente les tests réalisés sur le projet **Meal Planner**.

---

## Tests backend

### Outils utilisés

Les routes backend ont été testées avec :

- Postman
- Swagger
- Tests manuels depuis le frontend et le mobile

### Routes testées

#### Authentification

- `POST /auth/register`
- `POST /auth/login`

#### Recettes

- `GET /recipes`
- `GET /recipes/external/:id`
- `GET /recipes/local/:id`
- `POST /recipes`
- `PUT /recipes/:id`
- `DELETE /recipes/:id`

#### Planning

- `POST /meal-plans`
- `GET /meal-plans/week?date=YYYY-MM-DD`
- `DELETE /meal-plans/:id`

#### Liste de courses

- `GET /shopping-list/week?date=YYYY-MM-DD`
- `POST /shopping-list/items`
- `PATCH /shopping-list/items/:id`
- `DELETE /shopping-list/items/:id`
- `PATCH /shopping-list/auto`
- `PATCH /shopping-list/auto/hide`

---

## Tests frontend web

Sur le frontend web, nous avons testé :

- la connexion utilisateur
- l’affichage des recettes
- la recherche de recettes
- l’affichage du détail d’une recette
- la création d’une recette locale
- la modification d’une recette locale
- la suppression d’une recette locale
- l’ajout d’une recette au planning
- l’affichage du planning semaine
- la génération de la liste de courses
- l’ajout manuel d’un ingrédient
- le cochage / décochage d’un ingrédient manuel
- le cochage / décochage d’un ingrédient automatique
- la suppression d’un ingrédient manuel
- le masquage d’un ingrédient automatique

---

## Tests mobile

Sur l’application mobile, nous avons testé :

- la connexion utilisateur
- l’affichage des recettes
- l’affichage du détail d’une recette
- la création d’une recette
- l’ajout au planning
- l’affichage du planning semaine
- l’affichage de la liste de courses
- l’ajout manuel d’un ingrédient
- le cochage / décochage d’un ingrédient
- la suppression d’un ingrédient

---

## Tests frontend avec Vitest

Des tests simples ont été ajoutés côté frontend afin de vérifier certaines logiques utilisées dans l’application.

Les tests portent sur :

- le format de date
- le calcul du nombre d’ingrédients cochés
- la séparation des ingrédients automatiques et manuels

Commande utilisée :

```bash
cd frontend
npm run test:run
```

---

## Tests visuels avec Storybook

Storybook a été utilisé pour vérifier visuellement certains composants du frontend.

Commande utilisée :

```bash
cd frontend
npm run storybook
```

Build Storybook :

```bash
npm run build-storybook
```

---

## Conclusion

Les tests réalisés permettent de vérifier le bon fonctionnement des fonctionnalités principales du projet sur :

- le backend
- le frontend web
- l’application mobile

Le flux complet a été testé de la connexion jusqu’à la liste de courses.
