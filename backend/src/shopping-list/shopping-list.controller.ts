import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { ShoppingListService } from './shopping-list.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { UpdateShoppingAutoItemDto } from './dto/update-shopping-auto-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Shopping List')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
/**
 * Controller responsable des routes de liste de courses.
 *
 * Il expose les endpoints permettant de récupérer la liste hebdomadaire,
 * gérer les items manuels et gérer l'état des ingrédients automatiques.
 */
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get('week')
  @ApiOperation({
    summary: 'Récupérer la liste de courses hebdomadaire',
    description:
      'Retourne les ingrédients automatiques issus du planning et les items manuels.',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    example: '2026-04-21',
    description: 'Date utilisée pour calculer la semaine.',
  })
  @ApiResponse({ status: 200, description: 'Liste de courses retournée.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.findWeek(date, user.userId);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Ajouter un ingrédient manuel',
    description: 'Ajoute un item manuel dans la liste de courses.',
  })
  @ApiBody({ type: CreateShoppingItemDto })
  @ApiResponse({ status: 201, description: 'Item manuel ajouté.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  createItem(
    @Body() createShoppingItemDto: CreateShoppingItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.createManualItem(
      createShoppingItemDto,
      user.userId,
    );
  }

  @Patch('items/:id')
  @ApiOperation({
    summary: 'Cocher ou décocher un item manuel',
    description: 'Met à jour uniquement l’état checked d’un item manuel.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de l’item manuel.',
  })
  @ApiBody({ type: UpdateShoppingItemDto })
  @ApiResponse({ status: 200, description: 'Item manuel mis à jour.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Item manuel introuvable.' })
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShoppingItemDto: UpdateShoppingItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.updateItem(
      id,
      updateShoppingItemDto,
      user.userId,
    );
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: 'Supprimer un item manuel',
    description: 'Supprime définitivement un item manuel de la liste de courses.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de l’item manuel.',
  })
  @ApiResponse({ status: 200, description: 'Item manuel supprimé.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Item manuel introuvable.' })
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.removeItem(id, user.userId);
  }

  @Patch('auto')
  @ApiOperation({
    summary: 'Cocher ou décocher un ingrédient automatique',
    description:
      'Stocke l’état checked d’un ingrédient automatique sans modifier la recette ni le planning.',
  })
  @ApiBody({ type: UpdateShoppingAutoItemDto })
  @ApiResponse({
    status: 200,
    description: 'État de l’ingrédient automatique mis à jour.',
  })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  updateAutoItem(
    @Body() updateShoppingAutoItemDto: UpdateShoppingAutoItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.updateAutoItem(
      updateShoppingAutoItemDto,
      user.userId,
    );
  }

  @Patch('auto/hide')
  @ApiOperation({
    summary: 'Masquer un ingrédient automatique',
    description:
      'Masque un ingrédient automatique dans la liste sans supprimer la recette ni le planning.',
  })
  @ApiBody({ type: UpdateShoppingAutoItemDto })
  @ApiResponse({
    status: 200,
    description: 'Ingrédient automatique masqué.',
  })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  hideAutoItem(
    @Body() updateShoppingAutoItemDto: UpdateShoppingAutoItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.hideAutoItem(
      updateShoppingAutoItemDto,
      user.userId,
    );
  }
}