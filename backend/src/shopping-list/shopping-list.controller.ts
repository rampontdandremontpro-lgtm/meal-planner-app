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
import { ShoppingListService } from './shopping-list.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  /**
   * Récupère la liste de courses de la semaine pour l'utilisateur connecté.
   *
   * Cette route renvoie une liste de courses hebdomadaire construite à partir
   * du planning repas de l'utilisateur et de ses ajouts manuels.
   *
   * Règles métier :
   * - les ingrédients automatiques sont recalculés depuis le meal plan ;
   * - les ingrédients manuels sont récupérés depuis la base de données ;
   * - seuls les éléments de l'utilisateur connecté sont renvoyés.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route GET /shopping-list/week?date=YYYY-MM-DD
   * @access Private (JWT)
   * @param date Date de référence utilisée pour calculer la semaine.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns La liste de courses hebdomadaire fusionnée.
   *
   * @throws {NotFoundException} Si l'utilisateur connecté est introuvable.
   */
  @Get('week')
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.findWeek(date, user.userId);
  }

  /**
   * Ajoute un ingrédient manuel à la liste de courses.
   *
   * Cette route permet à l'utilisateur connecté d'ajouter un élément manuel
   * qui sera stocké en base pour la semaine concernée.
   *
   * Règles métier :
   * - seuls les items manuels sont créés ici ;
   * - l'item est automatiquement rattaché à l'utilisateur connecté ;
   * - le début de semaine est calculé à partir de la date fournie.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route POST /shopping-list/items
   * @access Private (JWT)
   * @param createShoppingItemDto Données de l'item manuel à créer.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns L'item manuel créé.
   *
   * @throws {NotFoundException} Si l'utilisateur connecté est introuvable.
   */
  @Post('items')
  createItem(
    @Body() createShoppingItemDto: CreateShoppingItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.createManualItem(
      createShoppingItemDto,
      user.userId,
    );
  }

  /**
   * Met à jour l'état d'un ingrédient manuel.
   *
   * Cette route permet de cocher ou décocher un item manuel appartenant
   * à l'utilisateur connecté.
   *
   * Règles métier :
   * - seuls les items manuels du user connecté peuvent être modifiés ;
   * - la mise à jour porte ici sur le statut `checked`.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route PATCH /shopping-list/items/:id
   * @access Private (JWT)
   * @param id Identifiant de l'item manuel à mettre à jour.
   * @param updateShoppingItemDto Nouveau statut de l'item.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns L'item mis à jour.
   *
   * @throws {NotFoundException} Si l'item est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @Patch('items/:id')
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

  /**
   * Supprime un ingrédient manuel de la liste de courses.
   *
   * Cette route permet de retirer définitivement un item manuel appartenant
   * à l'utilisateur connecté.
   *
   * Règles métier :
   * - seuls les items manuels stockés en base peuvent être supprimés ;
   * - les items automatiques ne sont pas concernés car ils ne sont pas persistés.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route DELETE /shopping-list/items/:id
   * @access Private (JWT)
   * @param id Identifiant de l'item manuel à supprimer.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Un message de confirmation de suppression.
   *
   * @throws {NotFoundException} Si l'item est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @Delete('items/:id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.removeItem(id, user.userId);
  }
}