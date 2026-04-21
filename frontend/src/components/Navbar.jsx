import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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