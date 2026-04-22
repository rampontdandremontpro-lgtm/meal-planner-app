/**
 * @file Auth.stories.jsx
 * @description Stories Storybook des écrans d'authentification.
 * Fournit des rendus statiques des interfaces de connexion et d'inscription.
 */

export default {
  title: "Pages/Auth",
  tags: ["autodocs"],
};

export const Login = {
  render: () => (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Connexion</h1>
        <p>Connecte-toi à ton espace Meal Planner</p>

        <form className="auth-form">
          <input placeholder="Email" />
          <input placeholder="Mot de passe" type="password" />
          <button type="button">Se connecter</button>
        </form>

        <p className="auth-link-text">
          Pas encore de compte ? <a href="/">S’inscrire</a>
        </p>
      </div>
    </div>
  ),
};

export const Register = {
  render: () => (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Inscription</h1>
        <p>Crée ton compte Meal Planner</p>

        <form className="auth-form">
          <input placeholder="Prénom" />
          <input placeholder="Nom" />
          <input placeholder="Email" />
          <input placeholder="Mot de passe" type="password" />
          <button type="button">S’inscrire</button>
        </form>

        <p className="auth-link-text">
          Déjà un compte ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  ),
};