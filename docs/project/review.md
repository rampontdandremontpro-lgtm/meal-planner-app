# Code Review

Ce document présente le processus de review mis en place pendant le projet **Meal Planner**.

---

## Processus de review

Le code a été revu tout au long du projet grâce à :

- des échanges réguliers entre les membres du binôme
- des tests après chaque intégration
- des corrections progressives des bugs
- des vérifications fonctionnelles sur le web et le mobile

---

## Objectifs de la review

La review avait pour objectif de :

- vérifier que le code ne cassait pas l’existant
- corriger les incohérences entre frontend et backend
- améliorer la structure du code
- stabiliser les fonctionnalités principales
- vérifier que les routes API étaient bien utilisées

---

## Points améliorés

Plusieurs points ont été améliorés grâce à la review :

- correction des routes API
- correction des payloads envoyés au backend
- cohérence entre ingrédients automatiques et manuels
- amélioration de l’UX de la liste de courses
- correction des erreurs de type dans le mobile
- ajout de Swagger
- amélioration de la documentation

---

## Exemple de refactorisation

La liste de courses a été refactorisée pour mieux gérer deux types d’ingrédients :

- ingrédients automatiques issus du planning
- ingrédients manuels ajoutés par l’utilisateur

Un système d’override a été ajouté pour permettre de cocher ou masquer un ingrédient automatique sans modifier la recette ni le planning.

---

## Conclusion

La review continue a permis de stabiliser le projet et de limiter les bugs bloquants avant le rendu final.
