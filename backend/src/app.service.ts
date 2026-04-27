import { Injectable } from '@nestjs/common';

/**
 * Service principal de l'application.
 *
 * Ce service contient une méthode simple utilisée par la route racine
 * pour confirmer que le backend est opérationnel.
 */
@Injectable()
export class AppService {
  /**
   * Retourne le message de vérification de l'API.
   *
   * @returns Message de bienvenue.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
