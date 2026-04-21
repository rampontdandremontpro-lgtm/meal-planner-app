import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Recherche un utilisateur à partir de son adresse email.
   *
   * Cette méthode est principalement utilisée lors de l'inscription
   * et de la connexion pour vérifier l'existence d'un compte.
   *
   * @param email Adresse email de l'utilisateur recherché.
   * @returns L'utilisateur correspondant ou `null` si aucun compte n'est trouvé.
   */
  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  /**
   * Recherche un utilisateur à partir de son identifiant.
   *
   * Cette méthode permet de récupérer un utilisateur existant
   * depuis la base de données.
   *
   * @param id Identifiant unique de l'utilisateur.
   * @returns L'utilisateur correspondant ou `null` si aucun utilisateur n'est trouvé.
   */
  findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Crée un nouvel utilisateur en base de données.
   *
   * Cette méthode instancie une entité `User` à partir des données fournies,
   * puis l'enregistre dans la base.
   *
   * @param data Données partielles permettant de créer un utilisateur.
   * @returns L'utilisateur créé et sauvegardé en base de données.
   */
  async create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
}