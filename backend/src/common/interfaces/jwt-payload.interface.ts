/**
 * Interface représentant le contenu utile du payload JWT.
 *
 * Cette structure est utilisée lors de la génération
 * et de la validation des tokens d'authentification.
 */
export interface JwtPayload {
  /**
   * Identifiant de l'utilisateur.
   */
  sub: number;

  /**
   * Adresse email de l'utilisateur.
   */
  email: string;
}