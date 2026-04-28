import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Démarre l'application NestJS.
 *
 * Cette fonction configure :
 * - CORS pour autoriser les appels du frontend ;
 * - le `ValidationPipe` global pour sécuriser les DTO ;
 * - Swagger pour exposer la documentation API ;
 * - le port d'écoute du serveur.
 *
 * @returns Une promesse résolue lorsque l'application est démarrée.
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Meal Planner API')
    .setDescription(
      'Documentation API du projet Meal Planner : authentification, recettes, planning repas et liste de courses.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
      },
      'JWT-auth',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
