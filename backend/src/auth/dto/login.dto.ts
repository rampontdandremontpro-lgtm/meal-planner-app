import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

/**
 * DTO utilisé pour connecter un utilisateur.
 *
 * Il valide les données envoyées sur la route `POST /auth/login`.
 */
export class LoginDto {
  /**
   * Adresse email de l'utilisateur.
   */
  @ApiProperty({
    example: 'daphne@test.com',
    description: "Adresse email de l'utilisateur.",
  })
  @IsEmail()
  email!: string;

  /**
   * Mot de passe en clair envoyé lors de la connexion.
   */
  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe utilisateur.',
  })
  @MinLength(6)
  password!: string;
}
