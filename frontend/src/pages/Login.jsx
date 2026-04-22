/**
 * @file Login.jsx
 * @description Page de connexion utilisateur.
 * Capture les identifiants, appelle la logique d'authentification et gère
 * l'affichage des erreurs ou du chargement.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Rend la page de connexion.
 *
 * @returns {JSX.Element} Formulaire de connexion.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Met à jour un champ du formulaire de connexion.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e Événement de saisie.
   * @returns {void}
   */
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Tente d'authentifier l'utilisateur.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Événement de soumission.
   * @returns {Promise<void>} Promesse de connexion.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/recipes");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la connexion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Connexion</h1>
        <p>Connecte-toi à ton espace Meal Planner</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-link-text">
          Pas encore de compte ? <Link to="/register">S’inscrire</Link>
        </p>
      </div>
    </div>
  );
}