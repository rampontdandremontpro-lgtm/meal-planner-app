import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      <div className="home-card">
        <h1>Meal Planner</h1>
        <p>Connexion réussie 🎉</p>

        <p>
          Bienvenue {user?.firstname ? `${user.firstname} ${user.lastname}` : ""}
        </p>

        <button onClick={logout}>Se déconnecter</button>
      </div>
    </div>
  );
}