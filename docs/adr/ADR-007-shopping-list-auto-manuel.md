# ADR-007 — Séparation des ingrédients automatiques et manuels

## Statut
Accepté

## Contexte
La liste de courses contient deux types d’ingrédients :

- les ingrédients automatiques issus du planning
- les ingrédients manuels ajoutés par l’utilisateur

Le problème était de permettre à l’utilisateur de cocher ou masquer un ingrédient automatique sans modifier la recette ni le planning.

## Décision
Nous avons choisi de créer un système d’override avec l’entité `ShoppingListAutoState`.

Ce système permet de stocker :

- l’état `checked`
- l’état `hidden`

sans modifier les données sources.

## Conséquences positives
- Les recettes restent intactes
- Le planning n’est pas modifié
- L’utilisateur peut personnaliser sa liste de courses
- L’UX est plus cohérente

## Conséquences négatives
- Ajout de complexité backend
- Nécessité de fusionner plusieurs sources de données

## Alternatives envisagées
- Modifier directement les recettes : refusé car cela casse les données sources
- Supprimer l’ingrédient du planning : refusé car cela n’a pas de sens métier
- Transformer les ingrédients automatiques en manuels : refusé car cela rend les données incohérentes
