/**
 * @file ShoppingList.jsx
 * @description Page de liste de courses.
 * Sert actuellement de placeholder en attendant le branchement complet de
 * la fonctionnalité correspondante.
 */

/**
 * Rend la page placeholder de la liste de courses.
 *
 * @returns {JSX.Element} Bloc d'attente de fonctionnalité.
 */
export default function ShoppingList() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Liste de courses</h1>
          <p>Cette page sera branchée au jour 3.</p>
        </div>
      </div>

      <div className="placeholder-card">
        <p>La liste de courses arrive bientôt.</p>
      </div>
    </div>
  );
}