# ADR-002 — Utilisation de PostgreSQL et TypeORM

## Statut
Accepté

## Contexte
Le projet nécessite une base de données relationnelle pour gérer les utilisateurs, recettes et planning.

## Décision
Utilisation de PostgreSQL avec TypeORM.

## Conséquences positives
- Base relationnelle robuste
- TypeORM facilite les requêtes
- Bonne intégration avec NestJS

## Conséquences négatives
- Configuration initiale plus complexe
- Moins flexible qu’une base NoSQL

## Alternatives envisagées
- MongoDB : moins adapté aux relations complexes