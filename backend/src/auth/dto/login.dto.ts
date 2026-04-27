import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'daphne@test.com',
    description: "Adresse email de l'utilisateur.",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe utilisateur.',
  })
  @MinLength(6)
  password!: string;
}