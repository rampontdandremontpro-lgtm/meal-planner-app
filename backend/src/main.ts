import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Point d'entrée principal de l'application NestJS.
 *
 * Cette fonction démarre le serveur HTTP, active CORS
 * et configure un `ValidationPipe` global pour sécuriser
 * et transformer automatiquement les données entrantes.
 *
 * Règles métier :
 * - `whitelist: true` supprime les propriétés non attendues ;
 * - `forbidNonWhitelisted: true` rejette les champs inconnus ;
 * - `transform: true` convertit automatiquement certains types attendus ;
 * - le serveur écoute sur le port défini dans `PORT` ou sur `3000` par défaut.
 *
 * @returns Une promesse résolue une fois l'application démarrée.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();