# ADR-003 — Authentification avec JWT

## Statut
Accepté

## Contexte
L’application nécessite une authentification sécurisée afin de protéger les fonctionnalités utilisateur.

## Décision
Nous avons choisi JWT pour gérer l’authentification.

## Conséquences positives
- Authentification stateless
- Compatible avec le frontend web et le mobile
- Facile à intégrer avec NestJS

## Conséquences négatives
- Gestion du token nécessaire côté client
- Révocation moins simple qu’avec des sessions serveur

## Alternatives envisagées
- Sessions serveur
