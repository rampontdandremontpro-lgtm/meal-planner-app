import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        </nav>
      </div>
    </header>
  );
}