import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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