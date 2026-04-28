# ADR-002 — Utilisation de PostgreSQL et TypeORM

## Statut
Accepté

## Contexte
Le projet nécessite une base de données relationnelle pour gérer les utilisateurs, les recettes, le planning et la liste de courses.

## Décision
Nous avons choisi PostgreSQL avec TypeORM.

## Conséquences positives
- Base relationnelle robuste
- Relations claires entre les entités
- TypeORM facilite les requêtes et l’intégration avec NestJS

## Conséquences négatives
- Configuration initiale plus complexe
- Moins flexible qu’une base NoSQL

## Alternatives envisagées
- MongoDB : moins adapté aux relations du projet complexe
