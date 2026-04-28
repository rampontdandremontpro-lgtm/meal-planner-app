import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

/**
 * Module dédié à la gestion des utilisateurs.
 *
 * Ce module expose le service utilisateur aux autres parties
 * de l'application, notamment l'authentification, les recettes,
 * le planning repas et la liste de courses.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
