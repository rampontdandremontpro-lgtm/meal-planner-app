/**
 * @file Button.jsx
 * @description Bouton réutilisable très simple utilisé comme composant
 * de base pour certains tests ou démonstrations.
 */

/**
 * Rend un bouton simple.
 *
 * @param {Object} props Propriétés du composant.
 * @param {React.ReactNode} props.children Contenu du bouton.
 * @param {React.MouseEventHandler<HTMLButtonElement>} [props.onClick] Gestionnaire de clic.
 * @returns {JSX.Element} Élément bouton.
 */
export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}