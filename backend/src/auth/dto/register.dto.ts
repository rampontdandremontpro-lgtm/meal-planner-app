import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO utilisé pour l'inscription d'un utilisateur.
 *
 * Cette classe valide les données reçues lors de l'appel
 * à la route `POST /auth/register`.
 *
 * Règles métier :
 * - `firstName` est obligatoire ;
 * - `lastName` est obligatoire ;
 * - l'email doit être valide ;
 * - le mot de passe doit contenir au moins 6 caractères.
 */
export class RegisterDto {
  /**
   * Prénom de l'utilisateur.
   */
  @IsNotEmpty()
  firstName!: string;

  /**
   * Nom de famille de l'utilisateur.
   */
  @IsNotEmpty()
  lastName!: string;

  /**
   * Adresse email de l'utilisateur.
   */
  @IsEmail()
  email!: string;

  /**
   * Mot de passe en clair fourni à l'inscription.
   */
  @MinLength(6)
  password!: string;
}