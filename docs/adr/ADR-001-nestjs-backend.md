# ADR-001 — Utilisation de NestJS pour le backend

## Statut
Accepté

## Contexte
Le projet Meal Planner nécessite un backend structuré capable de gérer plusieurs fonctionnalités : authentification, recettes, planning et liste de courses.

## Décision
Nous avons choisi d’utiliser NestJS pour développer le backend.

## Conséquences positives
- Architecture modulaire claire (controllers, services, modules)
- Utilisation de TypeScript
- Bonne intégration avec TypeORM et JWT
- Facilité d’ajout de Swagger

## Conséquences négatives
- Courbe d’apprentissage
- Structure plus lourde qu’Express

## Alternatives envisagées
- Express.js : plus simple mais moins structuré