import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard JWT utilisé pour protéger les routes privées.
 *
 * Ce guard délègue la validation du token à la stratégie Passport `jwt`.
 * Il est utilisé sur les routes nécessitant un utilisateur authentifié.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
