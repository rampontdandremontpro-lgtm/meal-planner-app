import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Daphné',
    description: "Prénom de l'utilisateur.",
  })
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Rampont',
    description: "Nom de famille de l'utilisateur.",
  })
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'daphne@test.com',
    description: "Adresse email de l'utilisateur.",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe avec au moins 6 caractères.',
  })
  @MinLength(6)
  password!: string;
}