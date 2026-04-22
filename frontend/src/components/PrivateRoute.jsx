/**
 * @file PrivateRoute.jsx
 * @description Garde de route côté interface.
 * Empêche l'accès aux pages privées tant que l'utilisateur n'est pas
 * authentifié et affiche un état de chargement si nécessaire.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protège une route en vérifiant l'authentification.
 *
 * @param {Object} props Propriétés du composant.
 * @param {React.ReactNode} props.children Contenu à rendre si autorisé.
 * @returns {JSX.Element|React.ReactNode} Redirection, chargement ou contenu.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}