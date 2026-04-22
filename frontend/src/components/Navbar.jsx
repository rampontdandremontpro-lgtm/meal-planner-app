/**
 * @file Navbar.jsx
 * @description Barre de navigation principale de l'application.
 * Affiche les liens publics et privés selon l'état de connexion de
 * l'utilisateur et gère la déconnexion.
 */

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Affiche la navigation principale et les actions liées à la session.
 *
 * @returns {JSX.Element} En-tête de navigation.
 */
export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Déconnecte l'utilisateur puis le redirige vers la liste des recettes.
   *
   * @returns {void}
   */
  function handleLogout() {
    logout();
    navigate("/recipes");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/recipes" className="brand">
          <span className="brand-icon">👨‍🍳</span>
          <span>Meal Planner</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Recettes
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/planner"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Planning
              </NavLink>

              <NavLink
                to="/shopping"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Courses
              </NavLink>
            </>
          )}

          {!isAuthenticated ? (
            <NavLink to="/login" className="nav-link auth-link">
              Connexion
            </NavLink>
          ) : (
            <button className="nav-link auth-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}