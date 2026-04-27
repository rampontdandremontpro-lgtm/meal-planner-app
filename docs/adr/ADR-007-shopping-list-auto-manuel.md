# ADR-007 — Séparation des ingrédients automatiques et manuels

## Statut
Accepté

## Contexte
Les ingrédients de la liste de courses proviennent :
- du planning (automatiques)
- de l’utilisateur (manuels)

Le problème était de permettre :
- cocher un ingrédient
- supprimer un ingrédient

sans modifier les recettes ou le planning.

## Décision
Créer un système d’override (ShoppingListAutoState) permettant de :
- stocker l’état checked
- masquer un ingrédient (hidden)

sans modifier les données sources.

## Conséquences positives
- Données cohérentes
- UX propre
- Pas de modification des recettes

## Conséquences négatives
- Complexité backend supplémentaire

## Alternatives envisagées
- Modifier les recettes → refusé
- Supprimer du planning → refusé