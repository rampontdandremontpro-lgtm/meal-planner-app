import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { MealPlansModule } from './meal-plans/meal-plans.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

/**
 * Module racine de l'application NestJS.
 *
 * Ce module centralise :
 * - la configuration globale ;
 * - la connexion à la base PostgreSQL ;
 * - l'import des modules métiers.
 *
 * Rôle :
 * - démarrer l'application ;
 * - charger les variables d'environnement ;
 * - initialiser TypeORM ;
 * - brancher tous les modules fonctionnels du projet.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    UsersModule,
    RecipesModule,
    MealPlansModule,
    ShoppingListModule,
  ],
})
export class AppModule {}