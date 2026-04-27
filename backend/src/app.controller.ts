import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller principal de l'application.
 *
 * Ce controller expose une route simple permettant de vérifier
 * que l'API NestJS est bien démarrée et accessible.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retourne un message de bienvenue.
   *
   * @returns Message indiquant que l'application fonctionne.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
