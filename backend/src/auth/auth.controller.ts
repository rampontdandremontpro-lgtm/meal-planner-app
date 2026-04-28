import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
/**
 * Controller responsable de l'authentification.
 *
 * Il expose les routes publiques d'inscription et de connexion
 * utilisées pour créer un compte et obtenir un token JWT.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Inscription utilisateur',
    description:
      'Crée un nouvel utilisateur avec prénom, nom, email et mot de passe.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé ou données invalides.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: 'Connecte un utilisateur et retourne un token JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Connexion réussie avec token JWT.',
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
