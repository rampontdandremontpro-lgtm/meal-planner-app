import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  /**
   * Crée une nouvelle recette locale liée à l'utilisateur connecté.
   *
   * Cette route permet à un utilisateur authentifié d'enregistrer
   * une recette personnelle dans la base de données. La recette créée
   * sera automatiquement associée à l'utilisateur connecté.
   *
   * Règles métier :
   * - seules les recettes locales sont créées via cette route ;
   * - la recette est rattachée à l'utilisateur authentifié ;
   * - les ingrédients fournis dans le DTO sont enregistrés avec la recette.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route POST /recipes
   * @access Private (JWT)
   * @param createRecipeDto Données nécessaires à la création de la recette locale.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns La recette locale créée et formatée pour la réponse API.
   *
   * @throws {NotFoundException} Si l'utilisateur connecté est introuvable.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.create(createRecipeDto, user.userId);
  }

  /**
   * Récupère la liste des recettes disponibles.
   *
   * Cette route renvoie toujours les recettes externes provenant de TheMealDB.
   * Lorsqu'un utilisateur est authentifié, la réponse contient également
   * ses recettes locales personnelles.
   *
   * Règles métier :
   * - sans token : seules les recettes externes sont renvoyées ;
   * - avec token : les recettes externes et les recettes locales du user
   *   connecté sont fusionnées dans la réponse ;
   * - le paramètre `search` permet de filtrer les recettes selon un mot-clé.
   *
   * Sécurité :
   * - JWT optionnel ;
   * - la route reste accessible sans authentification.
   *
   * @route GET /recipes
   * @access Public / Optional JWT
   * @param search Mot-clé de recherche optionnel.
   * @param user Utilisateur authentifié si un token valide est présent.
   * @returns Une liste de recettes externes uniquement, ou une liste fusionnée
   * avec les recettes locales de l'utilisateur connecté.
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(
    @Query('search') search?: string,
    @CurrentUser() user?: { userId: number; email: string } | null,
  ) {
    return this.recipesService.findAll(search, user?.userId);
  }

  /**
   * Récupère le détail d'une recette externe depuis TheMealDB.
   *
   * Cette route permet d'obtenir les informations détaillées d'une recette
   * externe à partir de son identifiant fourni par l'API TheMealDB.
   *
   * Règles métier :
   * - cette route ne consulte pas les recettes locales ;
   * - l'identifiant transmis correspond à un identifiant externe ;
   * - la réponse est harmonisée côté backend avant d'être renvoyée au front.
   *
   * Sécurité :
   * - route publique ;
   * - aucune authentification n'est requise.
   *
   * @route GET /recipes/external/:id
   * @access Public
   * @param id Identifiant externe de la recette dans TheMealDB.
   * @returns Le détail de la recette externe.
   *
   * @throws {NotFoundException} Si aucune recette externe ne correspond à l'identifiant fourni.
   */
  @Get('external/:id')
  findExternalById(@Param('id') id: string) {
    return this.recipesService.findExternalById(id);
  }

  /**
   * Récupère une recette locale appartenant à l'utilisateur connecté.
   *
   * Cette route permet à un utilisateur authentifié de consulter le détail
   * d'une de ses propres recettes locales enregistrées en base.
   *
   * Règles métier :
   * - seules les recettes locales du user connecté sont accessibles ;
   * - une recette locale d'un autre utilisateur ne doit pas être renvoyée.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route GET /recipes/local/:id
   * @access Private (JWT)
   * @param id Identifiant local de la recette.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Le détail complet de la recette locale.
   *
   * @throws {NotFoundException} Si la recette locale n'existe pas
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @UseGuards(JwtAuthGuard)
  @Get('local/:id')
  findOneLocal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.findOneLocalForUser(id, user.userId);
  }

  /**
   * Met à jour une recette locale appartenant à l'utilisateur connecté.
   *
   * Cette route permet à un utilisateur authentifié de modifier une recette
   * locale déjà enregistrée, à condition qu'elle lui appartienne.
   *
   * Règles métier :
   * - seules les recettes locales du user connecté peuvent être modifiées ;
   * - les anciens ingrédients sont remplacés par ceux fournis dans le DTO ;
   * - les recettes externes ne sont jamais modifiées via cette route.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route PUT /recipes/:id
   * @access Private (JWT)
   * @param id Identifiant local de la recette à modifier.
   * @param updateRecipeDto Données mises à jour de la recette.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns La recette locale mise à jour.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.update(id, updateRecipeDto, user.userId);
  }

  /**
   * Supprime une recette locale appartenant à l'utilisateur connecté.
   *
   * Cette route permet à un utilisateur authentifié de supprimer une recette
   * locale enregistrée dans son espace personnel.
   *
   * Règles métier :
   * - seules les recettes locales du user connecté peuvent être supprimées ;
   * - les recettes externes ne sont jamais supprimées via cette route ;
   * - si la recette n'existe pas ou n'appartient pas au user, elle est
   *   considérée comme introuvable.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route DELETE /recipes/:id
   * @access Private (JWT)
   * @param id Identifiant local de la recette à supprimer.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Un message de confirmation de suppression.
   *
   * @throws {NotFoundException} Si la recette locale est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.remove(id, user.userId);
  }
}