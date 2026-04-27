/**
 * @file AuthContext.jsx
 * @description Contexte global d'authentification.
 * Centralise l'utilisateur courant, le token, le chargement initial, les
 * actions de connexion, d'inscription, de déconnexion et l'accès au statut
 * d'authentification dans toute l'application.
 */

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Contexte React partagé pour l'authentification.
 *
 * @type {React.Context<any>}
 */
export const AuthContext = createContext(null);

/**
 * Fournit l'état d'authentification et les actions associées à l'application.
 *
 * @param {Object} props Propriétés du provider.
 * @param {React.ReactNode} props.children Contenu enfant à envelopper.
 * @returns {JSX.Element} Provider React prêt à être consommé.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Connecte l'utilisateur et stocke le token ainsi que le profil en session.
   *
   * @param {string} email Adresse email de l'utilisateur.
   * @param {string} password Mot de passe utilisateur.
   * @returns {Promise<any>} Réponse brute renvoyée par le backend.
   */
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = response.data.access_token || response.data.token;
    const returnedUser = response.data.user || null;

    if (accessToken) {
      sessionStorage.setItem("token", accessToken);
      setToken(accessToken);
    }

    if (returnedUser) {
      sessionStorage.setItem("user", JSON.stringify(returnedUser));
      setUser(returnedUser);
    }

    return response.data;
  };

  /**
   * Inscrit un nouvel utilisateur via l'API.
   *
   * @param {string} firstName Prénom.
   * @param {string} lastName Nom.
   * @param {string} email Adresse email.
   * @param {string} password Mot de passe.
   * @returns {Promise<any>} Réponse brute du backend.
   */
  const register = async (firstName, lastName, email, password) => {
    const response = await api.post("/auth/register", {
      firstName: firstName,
      lastName: lastName,
      email,
      password,
    });

    return response.data;
  };

  /**
   * Supprime les informations de session locales et réinitialise l'état.
   *
   * @returns {void}
   */
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Accède simplement au contexte d'authentification.
 *
 * @returns {any} Valeur exposée par le provider d'authentification.
 */
export function useAuth() {
  return useContext(AuthContext);
}