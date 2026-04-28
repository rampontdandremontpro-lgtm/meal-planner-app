import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initialise la stratégie JWT utilisée par Passport.
   *
   * Cette stratégie extrait le token depuis le header Authorization
   * au format Bearer et utilise la clé secrète définie dans le fichier `.env`
   * pour valider sa signature.
   *
   * Règles métier :
   * - le token doit être envoyé sous la forme `Bearer <token>` ;
   * - l'expiration du token est vérifiée automatiquement ;
   * - la clé `JWT_SECRET` est obligatoire dans la configuration.
   *
   * @param configService Service d'accès aux variables d'environnement.
   * @throws {Error} Si la variable `JWT_SECRET` est absente.
   */
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET est manquant dans le fichier .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Transforme le payload JWT validé en objet utilisateur injecté dans la requête.
   *
   * Cette méthode est appelée automatiquement après validation du token.
   *
   * @param payload Payload décodé du token JWT.
   * @returns Un objet utilisateur simplifié contenant l'identifiant et l'email.
   */
  async validate(payload: { sub: number; email: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
