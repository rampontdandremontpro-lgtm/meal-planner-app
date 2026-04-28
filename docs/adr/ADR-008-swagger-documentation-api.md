# ADR-008 — Utilisation de Swagger

## Statut
Accepté

## Contexte
Le projet nécessite une documentation claire des routes API pour faciliter les tests et l’intégration avec le frontend et le mobile.

## Décision
Nous avons choisi Swagger avec NestJS.

## Conséquences positives
- Documentation automatique des routes
- Possibilité de tester les endpoints
- Visualisation claire de l’API
- Facilite la communication entre backend, frontend et mobile

## Conséquences négatives
- Nécessite l’ajout de décorateurs dans les controllers et DTO
- Documentation à maintenir si les routes changent

## Alternatives envisagées
- Documentation manuelle dans le README
- Collection Postman uniquement
