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
import { UpdateShoppingAutoItemDto } from './dto/update-shopping-auto-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  /**
   * Récupère la liste de courses hebdomadaire.
   */
  @Get('week')
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.findWeek(date, user.userId);
  }

  /**
   * Ajoute un item manuel.
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
   * Coche ou décoche un item manuel.
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
   * Supprime un item manuel.
   */
  @Delete('items/:id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.removeItem(id, user.userId);
  }

  /**
   * Coche ou décoche un ingrédient automatique.
   *
   * Cette route ne modifie pas la recette ni le planning.
   * Elle stocke seulement l'état utilisateur de l'ingrédient automatique.
   */
  @Patch('auto')
  updateAutoItem(
    @Body() updateShoppingAutoItemDto: UpdateShoppingAutoItemDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.updateAutoItem(
      updateShoppingAutoItemDto,
      user.userId,
    );
  }

  /**
   * Masque un ingrédient automatique de la liste de courses.
   *
   * Cette route ne supprime pas la recette, le planning ou l'ingrédient source.
   * Elle masque seulement l'ingrédient dans la liste de courses du user.
   */
  @Patch('auto/hide')
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