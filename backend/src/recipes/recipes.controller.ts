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
   * @route POST /recipes
   * @access Private (JWT)
   * @param createRecipeDto Données de la recette à créer
   * @param user Utilisateur connecté
   * @returns La recette créée
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
   * Récupère les recettes.
   * - Sans token : recettes externes uniquement
   * - Avec token : recettes externes + recettes locales de l'utilisateur connecté
   *
   * @route GET /recipes
   * @access Public / Optional JWT
   * @param search Mot-clé de recherche optionnel
   * @param user Utilisateur connecté si présent
   * @returns Liste des recettes
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
   * Récupère le détail d'une recette externe via TheMealDB.
   *
   * @route GET /recipes/external/:id
   * @access Public
   * @param id Identifiant externe de la recette
   * @returns Le détail de la recette externe
   */
  @Get('external/:id')
  findExternalById(@Param('id') id: string) {
    return this.recipesService.findExternalById(id);
  }

  /**
   * Récupère une recette locale appartenant à l'utilisateur connecté.
   *
   * @route GET /recipes/local/:id
   * @access Private (JWT)
   * @param id Identifiant local de la recette
   * @param user Utilisateur connecté
   * @returns Le détail de la recette locale
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
   * @route PUT /recipes/:id
   * @access Private (JWT)
   * @param id Identifiant de la recette
   * @param updateRecipeDto Données mises à jour
   * @param user Utilisateur connecté
   * @returns La recette mise à jour
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
   * @route DELETE /recipes/:id
   * @access Private (JWT)
   * @param id Identifiant de la recette
   * @param user Utilisateur connecté
   * @returns Message de confirmation
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