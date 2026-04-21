import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inscrit un nouvel utilisateur.
   *
   * Cette route permet de créer un compte utilisateur à partir des informations
   * fournies lors de l'inscription. Le mot de passe est hashé avant d'être
   * enregistré en base de données.
   *
   * Règles métier :
   * - l'adresse email doit être unique ;
   * - le champ `name` est construit à partir de `firstName` et `lastName` ;
   * - le mot de passe n'est jamais stocké en clair.
   *
   * Sécurité :
   * - route publique ;
   * - aucune authentification n'est requise.
   *
   * @route POST /auth/register
   * @access Public
   * @param registerDto Données d'inscription de l'utilisateur.
   * @returns Un message de confirmation et les informations publiques du nouvel utilisateur.
   *
   * @throws {BadRequestException} Si l'email est déjà utilisé.
   */
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Authentifie un utilisateur existant.
   *
   * Cette route vérifie les identifiants fournis puis génère un token JWT
   * permettant d'accéder aux routes protégées du backend.
   *
   * Règles métier :
   * - l'utilisateur doit exister ;
   * - le mot de passe doit correspondre au hash stocké en base ;
   * - en cas de succès, un token JWT est renvoyé avec les informations publiques du user.
   *
   * Sécurité :
   * - route publique ;
   * - aucune authentification préalable n'est requise.
   *
   * @route POST /auth/login
   * @access Public
   * @param loginDto Identifiants de connexion de l'utilisateur.
   * @returns Un token JWT et les informations publiques de l'utilisateur connecté.
   *
   * @throws {UnauthorizedException} Si les identifiants sont invalides.
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}