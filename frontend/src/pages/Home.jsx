/**
 * @file Home.jsx
 * @description Ancienne page d'accueil/authentification réussie.
 * Affiche un message de bienvenue simple et une action de déconnexion.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Rend un petit écran de bienvenue post-connexion.
 *
 * @returns {JSX.Element} Carte d'accueil.
 */
export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Déconnecte l'utilisateur puis redirige vers la page de connexion.
   *
   * @returns {void}
   */
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <h1>Meal Planner</h1>
        <p>Connexion réussie 🎉</p>

        <p>
          Bienvenue{" "}
          {user?.firstname
            ? `${user.firstname} ${user.lastname || ""}`
            : "utilisateur"}
        </p>

        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}