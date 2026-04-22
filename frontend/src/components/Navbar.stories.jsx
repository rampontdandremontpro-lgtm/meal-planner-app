/**
 * @file Navbar.stories.jsx
 * @description Stories Storybook de la barre de navigation.
 * Simule plusieurs états d'authentification via le contexte AuthContext.
 */

import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";

function renderNavbar(authValue, initialPath = "/recipes") {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider
        value={{
          user: null,
          token: "",
          loading: false,
          login: async () => {},
          register: async () => {},
          logout: () => {},
          isAuthenticated: false,
          ...authValue,
        }}
      >
        <Navbar />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

export default {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
};

export const LoggedOut = {
  render: () =>
    renderNavbar({
      isAuthenticated: false,
      user: null,
      token: "",
    }),
};

export const LoggedInRecipes = {
  render: () =>
    renderNavbar(
      {
        isAuthenticated: true,
        user: { firstname: "Gregory", name: "Gregory" },
        token: "fake-token",
      },
      "/recipes"
    ),
};

export const LoggedInPlanner = {
  render: () =>
    renderNavbar(
      {
        isAuthenticated: true,
        user: { firstname: "Gregory", name: "Gregory" },
        token: "fake-token",
      },
      "/planner"
    ),
};