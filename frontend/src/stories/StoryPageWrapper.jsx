/**
 * @file StoryPageWrapper.jsx
 * @description Conteneur de présentation pour les stories du projet.
 * Uniformise la mise en page, le titre et le sous-titre des démonstrations.
 */

/**
 * Encadre une story avec un titre et un sous-titre optionnels.
 *
 * @param {Object} props Propriétés du composant.
 * @param {string} [props.title] Titre de page.
 * @param {string} [props.subtitle] Sous-titre de page.
 * @param {React.ReactNode} props.children Contenu à afficher dans la page.
 * @returns {JSX.Element} Conteneur de story.
 */
export default function StoryPageWrapper({ title, subtitle, children }) {
  return (
    <div className="page-container">
      {(title || subtitle) && (
        <div className="page-header">
          <div>
            {title ? <h1>{title}</h1> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}