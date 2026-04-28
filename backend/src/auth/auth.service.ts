import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Inscrit un nouvel utilisateur en base de données.
   *
   * Cette méthode vérifie d'abord qu'aucun compte n'existe déjà avec l'email
   * fourni, puis hash le mot de passe avant de créer l'utilisateur.
   *
   * Règles métier :
   * - l'email doit être unique ;
   * - le nom complet est construit à partir de `firstName` et `lastName` ;
   * - le mot de passe est hashé avec bcrypt avant enregistrement ;
   * - la réponse ne renvoie jamais le mot de passe.
   *
   * @param registerDto Données d'inscription de l'utilisateur.
   * @returns Un message de confirmation et les informations publiques du compte créé.
   *
   * @throws {BadRequestException} Si l'email est déjà utilisé.
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const fullName = `${registerDto.firstName.trim()} ${registerDto.lastName.trim()}`;

    const user = await this.usersService.create({
      name: fullName,
      email: registerDto.email,
      password: hashedPassword,
    });

    return {
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Authentifie un utilisateur et génère un token JWT.
   *
   * Cette méthode recherche l'utilisateur à partir de son email, compare
   * le mot de passe fourni avec le hash stocké en base, puis génère
   * un token JWT valide si l'authentification réussit.
   *
   * Règles métier :
   * - l'utilisateur doit exister ;
   * - le mot de passe doit correspondre au hash enregistré ;
   * - le payload JWT contient l'identifiant et l'email de l'utilisateur ;
   * - la réponse ne renvoie jamais le mot de passe.
   *
   * @param loginDto Données de connexion de l'utilisateur.
   * @returns Un token JWT et les informations publiques de l'utilisateur.
   *
   * @throws {UnauthorizedException} Si l'utilisateur n'existe pas
   * ou si le mot de passe est invalide.
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
