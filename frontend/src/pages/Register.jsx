/**
 * @file Register.jsx
 * @description Page d'inscription utilisateur.
 * Collecte les informations du formulaire, appelle l'API d'inscription et
 * redirige ensuite vers la page de connexion après succès.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Rend la page d'inscription.
 *
 * @returns {JSX.Element} Formulaire de création de compte.
 */
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Met à jour un champ du formulaire d'inscription.
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
   * Envoie les données d'inscription au backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Événement de soumission.
   * @returns {Promise<void>} Promesse d'inscription.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(
        form.firstname,
        form.lastname,
        form.email,
        form.password
      );

      setSuccess("Compte créé avec succès. Connecte-toi pour accéder à ton espace.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l’inscription."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Inscription</h1>
        <p>Crée ton compte Meal Planner</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            value={form.firstname}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Nom"
            value={form.lastname}
            onChange={handleChange}
            required
          />

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
          {success && <p className="success-message">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </form>

        <p className="auth-link-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}