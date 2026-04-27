# ADR-003 — Authentification avec JWT

## Statut
Accepté

## Contexte
L’application nécessite une authentification sécurisée pour accéder aux fonctionnalités.

## Décision
Utilisation de JWT (JSON Web Token).

## Conséquences positives
- Authentification stateless
- Compatible web et mobile
- Facile à intégrer avec NestJS

## Conséquences négatives
- Gestion du token côté client nécessaire
- Pas de révocation simple

## Alternatives envisagées
- Sessions serveur