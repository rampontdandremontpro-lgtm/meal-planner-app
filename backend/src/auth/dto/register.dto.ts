import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO utilisé pour inscrire un nouvel utilisateur.
 *
 * Il valide les données envoyées sur la route `POST /auth/register`.
 */
export class RegisterDto {
  /**
   * Prénom de l'utilisateur.
   */
  @ApiProperty({
    example: 'Daphné',
    description: "Prénom de l'utilisateur.",
  })
  @IsNotEmpty()
  firstName!: string;

  /**
   * Nom de famille de l'utilisateur.
   */
  @ApiProperty({
    example: 'Rampont',
    description: "Nom de famille de l'utilisateur.",
  })
  @IsNotEmpty()
  lastName!: string;

  /**
   * Adresse email utilisée pour la connexion.
   */
  @ApiProperty({
    example: 'daphne@test.com',
    description: "Adresse email de l'utilisateur.",
  })
  @IsEmail()
  email!: string;

  /**
   * Mot de passe en clair avant hashage par bcrypt.
   */
  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe avec au moins 6 caractères.',
  })
  @MinLength(6)
  password!: string;
}
