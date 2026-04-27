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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une recette locale',
    description: 'Crée une recette personnelle pour l’utilisateur connecté.',
  })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({ status: 201, description: 'Recette créée avec succès.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.create(createRecipeDto, user.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Lister les recettes',
    description:
      'Retourne les recettes externes. Si un token est fourni, ajoute aussi les recettes locales de l’utilisateur.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'chicken',
    description: 'Recherche par mot-clé.',
  })
  @ApiResponse({ status: 200, description: 'Liste des recettes.' })
  findAll(
    @Query('search') search?: string,
    @CurrentUser() user?: { userId: number; email: string } | null,
  ) {
    return this.recipesService.findAll(search, user?.userId);
  }

  @Get('external/:id')
  @ApiOperation({
    summary: 'Détail d’une recette externe',
    description: 'Retourne le détail d’une recette depuis TheMealDB.',
  })
  @ApiParam({
    name: 'id',
    example: '52772',
    description: 'Identifiant externe TheMealDB.',
  })
  @ApiResponse({ status: 200, description: 'Recette externe trouvée.' })
  @ApiResponse({ status: 404, description: 'Recette externe introuvable.' })
  findExternalById(@Param('id') id: string) {
    return this.recipesService.findExternalById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('local/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Détail d’une recette locale',
    description: 'Retourne une recette locale appartenant à l’utilisateur connecté.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la recette locale.',
  })
  @ApiResponse({ status: 200, description: 'Recette locale trouvée.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Recette locale introuvable.' })
  findOneLocal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.findOneLocalForUser(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Modifier une recette locale',
    description: 'Modifie une recette locale appartenant à l’utilisateur connecté.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la recette locale.',
  })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({ status: 200, description: 'Recette modifiée avec succès.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Recette locale introuvable.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.update(id, updateRecipeDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une recette locale',
    description: 'Supprime une recette locale appartenant à l’utilisateur connecté.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la recette locale.',
  })
  @ApiResponse({ status: 200, description: 'Recette supprimée avec succès.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Recette locale introuvable.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.remove(id, user.userId);
  }
}