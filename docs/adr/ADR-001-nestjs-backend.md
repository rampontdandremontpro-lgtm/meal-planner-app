# ADR-001 — Utilisation de NestJS pour le backend

## Statut
Accepté

## Contexte
Le projet Meal Planner nécessite un backend structuré capable de gérer plusieurs fonctionnalités : authentification, recettes, planning et liste de courses.

## Décision
Nous avons choisi d’utiliser NestJS pour développer le backend.

## Conséquences positives
- Architecture modulaire claire avec controllers, services et modules
- Utilisation de TypeScript
- Bonne intégration avec TypeORM et JWT
- Facilité d’ajout de Swagger

## Conséquences négatives
- Courbe d’apprentissage plus importante
- Structure plus lourde qu’un backend Express simple

## Alternatives envisagées
- Express.js : plus simple, mais moins structuré
