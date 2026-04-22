/**
 * @file api.jsx
 * @description Instance Axios centralisée utilisée par le frontend.
 * Définit l'URL de base de l'API et ajoute automatiquement le token JWT
 * dans les en-têtes des requêtes sortantes.
 */

import axios from "axios";

/**
 * Client Axios configuré pour communiquer avec le backend local.
 *
 * @type {import("axios").AxiosInstance}
 */
const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;