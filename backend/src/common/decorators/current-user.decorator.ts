import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Décorateur personnalisé permettant de récupérer l'utilisateur courant.
 *
 * Ce décorateur lit l'objet `user` injecté dans la requête HTTP par la stratégie JWT
 * et le rend directement accessible dans les paramètres des méthodes de controller.
 *
 * Utilisation :
 * - avec `JwtAuthGuard`, il renvoie l'utilisateur authentifié ;
 * - avec `OptionalJwtAuthGuard`, il peut renvoyer `null` si aucun token valide n'est fourni.
 *
 * @param _data Donnée optionnelle inutilisée dans cette implémentation.
 * @param ctx Contexte d'exécution NestJS.
 * @returns L'utilisateur courant stocké dans `request.user`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);