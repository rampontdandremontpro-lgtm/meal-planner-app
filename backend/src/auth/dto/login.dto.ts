import { IsEmail, MinLength } from 'class-validator';

/**
 * DTO utilisé pour la connexion d'un utilisateur.
 *
 * Cette classe valide les données reçues lors de l'appel
 * à la route `POST /auth/login`.
 *
 * Règles métier :
 * - l'email doit être au format valide ;
 * - le mot de passe doit contenir au moins 6 caractères.
 */
export class LoginDto {
  /**
   * Adresse email de l'utilisateur.
   */
  @IsEmail()
  email!: string;

  /**
   * Mot de passe en clair envoyé lors de la connexion.
   */
  @MinLength(6)
  password!: string;
}