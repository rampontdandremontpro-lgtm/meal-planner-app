# 🍽️ Meal Planner App

Projet full stack réalisé par **Gregory et Daphné** dans le cadre d’un projet de développement informatique.

---

## 🎯 Objectif du projet

L’application **Meal Planner** permet à un utilisateur de :

- Consulter des recettes (API externe + recettes locales)
- Créer ses propres recettes
- Organiser ses repas dans un planning hebdomadaire
- Générer automatiquement une liste de courses
- Gérer une liste de courses avec des ingrédients :
  - Automatiques (issus du planning)
  - Manuels (ajoutés par l’utilisateur)

---

## 🧱 Stack technique

### Backend
- NestJS
- PostgreSQL
- TypeORM
- JWT (authentification)
- Swagger (documentation API)

### Frontend Web
- React
- Vite
- Axios
- Storybook

### Mobile
- Kotlin
- Jetpack Compose
- Retrofit
- Architecture MVVM

---

## 📁 Structure du projet

/backend   → API NestJS  
/frontend  → Application web React  
/mobile    → Application Android Kotlin  
/docs      → ADR (décisions techniques)

---

## ⚙️ Fonctionnalités principales

### 🔐 Authentification
- Inscription
- Connexion
- Gestion via JWT

### 🍲 Recettes
- Récupération via API externe (TheMealDB)
- Création de recettes locales
- Modification / suppression

### 📅 Planning
- Affichage de la semaine (matin / midi / soir)
- Ajout de recettes au planning
- Suppression de repas

### 🛒 Liste de courses
- Génération automatique depuis le planning
- Ajout manuel d’ingrédients
- Cocher / décocher
- Suppression
- Persistance des états

---

## 🧠 Choix d’architecture important

Les ingrédients de la liste de courses sont séparés en :

- **Automatiques** (issus du planning)
- **Manuels** (ajoutés par l’utilisateur)

Les ingrédients automatiques ne sont **jamais modifiés directement**.

Un système d’override permet de :
- Cocher un ingrédient
- Masquer un ingrédient

Sans modifier la recette ni le planning.

---

## 📚 Documentation API

Swagger est disponible à l’adresse :

http://localhost:3000/api-docs

Permet de :
- Tester les routes
- Visualiser les endpoints
- Gérer l’authentification JWT

---

## 🚀 Lancer le projet

### Backend

cd backend  
npm install  
npm run start:dev  

### Frontend

cd frontend  
npm install  
npm run dev  

### Mobile (Android)

- Ouvrir le dossier /mobile dans Android Studio
- Lancer un émulateur
- Démarrer l’application

---

## 🧪 Tests effectués

- Création et suppression de recettes
- Ajout au planning
- Génération de la liste de courses
- Gestion des ingrédients automatiques et manuels
- Synchronisation frontend / mobile / backend

---

## 📄 Documentation technique

Les décisions techniques sont documentées dans :

/docs/adr

---

## 👨‍💻 Auteurs

- Gregory  
- Daphné  

---

## 🏁 État du projet

- ✅ Backend terminé  
- ✅ Frontend web terminé  
- ✅ Application mobile terminée  
- ✅ Documentation (Swagger + ADR) réalisée  

---

## 💬 Conclusion

Le projet **Meal Planner** propose une application complète multi-plateforme (web + mobile) avec une architecture propre, une API documentée et une gestion avancée de la liste de courses.
