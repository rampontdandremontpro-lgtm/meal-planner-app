import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Active l'authentification JWT uniquement si un header Authorization est présent.
   *
   * Cette garde permet de rendre l'authentification optionnelle sur certaines routes.
   * Si aucun token n'est fourni, la requête continue normalement sans utilisateur.
   *
   * @param context Contexte d'exécution NestJS.
   * @returns `true` si aucun token n'est présent, sinon délègue au guard JWT standard.
   */
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Gère le résultat final de l'authentification optionnelle.
   *
   * Si une erreur survient lors de la validation du token, aucun utilisateur
   * n'est injecté dans la requête. Cela permet de garder la route accessible
   * même avec un token absent ou invalide.
   *
   * @param err Erreur éventuelle issue du guard Passport.
   * @param user Utilisateur validé si le token est correct.
   * @returns L'utilisateur authentifié ou `null`.
   */
  handleRequest(err: any, user: any) {
    if (err) {
      return null;
    }

    return user ?? null;
  }
}