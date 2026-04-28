# ADR-006 — Utilisation de TheMealDB

## Statut
Accepté

## Contexte
Le projet nécessite des recettes sans devoir créer une base de données complète de recettes dès le départ.

## Décision
Nous avons choisi d’utiliser l’API externe TheMealDB.

## Conséquences positives
- Données disponibles rapidement
- Intégration simple
- Pas besoin de créer toutes les recettes manuellement
- Permet de combiner recettes externes et recettes locales

## Conséquences négatives
- Dépendance à une API externe
- Données parfois limitées
- Format des données à adapter côté backend

## Alternatives envisagées
- Créer toutes les recettes localement
- Utiliser une autre API comme Spoonacular
