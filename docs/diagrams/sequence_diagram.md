# Diagramme de séquence — Meal Planner

Ce diagramme représente le flux principal de l'application :

- Connexion utilisateur
- Consultation des recettes
- Ajout d’une recette au planning
- Génération de la liste de courses
- Gestion des ingrédients automatiques et manuels

## Diagramme Mermaid

```mermaid
sequenceDiagram
    title Meal Planner - Diagramme de séquence

    actor U as Utilisateur
    participant C as Frontend Web / Mobile
    participant API as API NestJS
    participant Auth as Auth JWT
    participant DB as PostgreSQL
    participant EXT as TheMealDB

    U->>C: Saisit email + mot de passe
    C->>API: POST /auth/login
    API->>DB: Vérifie l'utilisateur
    DB-->>API: Utilisateur valide
    API-->>C: Retourne un token JWT
    C-->>U: Connexion réussie

    U->>C: Consulte les recettes
    C->>API: GET /recipes
    API->>EXT: Récupère les recettes externes
    EXT-->>API: Liste des recettes
    API->>DB: Récupère les recettes locales
    DB-->>API: Recettes locales
    API-->>C: Retourne recettes externes + locales
    C-->>U: Affiche les recettes

    U->>C: Ajoute une recette au planning
    C->>API: POST /meal-plans avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié

    alt Recette locale
        API->>DB: Vérifie la recette locale
        DB-->>API: Recette locale trouvée
    else Recette externe
        API->>EXT: Vérifie la recette externe
        EXT-->>API: Recette externe trouvée
    end

    API->>DB: Enregistre le repas dans meal_plans
    DB-->>API: Repas planifié
    API-->>C: Confirmation ajout planning
    C-->>U: Planning mis à jour

    U->>C: Ouvre la liste de courses
    C->>API: GET /shopping-list/week?date=YYYY-MM-DD avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié

    API->>DB: Récupère les repas planifiés
    DB-->>API: Liste des repas

    loop Pour chaque repas du planning
        alt Recette locale
            API->>DB: Récupère les ingrédients de la recette
            DB-->>API: Ingrédients locaux
        else Recette externe
            API->>EXT: Récupère les ingrédients externes
            EXT-->>API: Ingrédients externes
        end
    end

    API->>DB: Récupère les ingrédients manuels
    DB-->>API: Items manuels

    API->>DB: Récupère les états automatiques checked / hidden
    DB-->>API: États des ingrédients automatiques

    API->>API: Fusionne ingrédients auto + manuels
    API-->>C: Retourne la liste de courses complète
    C-->>U: Affiche la liste séparée auto / manuel

    U->>C: Coche / décoche un ingrédient automatique
    C->>API: PATCH /shopping-list/auto avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié
    API->>DB: Crée ou met à jour ShoppingListAutoState
    DB-->>API: État sauvegardé
    API-->>C: Confirmation
    C-->>U: Ingrédient mis à jour

    U->>C: Masque un ingrédient automatique
    C->>API: PATCH /shopping-list/auto/hide avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié
    API->>DB: Enregistre hidden = true
    DB-->>API: Ingrédient masqué
    API-->>C: Confirmation
    C-->>U: Ingrédient retiré de la liste

    U->>C: Ajoute un ingrédient manuel
    C->>API: POST /shopping-list/items avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié
    API->>DB: Enregistre dans shopping_items
    DB-->>API: Item manuel créé
    API-->>C: Confirmation
    C-->>U: Ingrédient manuel affiché

    U->>C: Coche / supprime un ingrédient manuel
    C->>API: PATCH ou DELETE /shopping-list/items/:id avec JWT
    API->>Auth: Vérifie le token JWT
    Auth-->>API: Utilisateur authentifié
    API->>DB: Met à jour ou supprime shopping_items
    DB-->>API: Modification validée
    API-->>C: Confirmation
    C-->>U: Liste de courses mise à jour
```

## Description

Le frontend web et l’application mobile communiquent avec une API NestJS.

Les données proviennent de deux sources :

- PostgreSQL pour les utilisateurs, recettes locales, planning et liste de courses
- TheMealDB pour les recettes externes

La liste de courses fusionne :

- les ingrédients automatiques issus du planning
- les ingrédients manuels ajoutés par l’utilisateur

Les ingrédients automatiques ne sont pas supprimés directement : un système d’état permet de les cocher ou de les masquer.
