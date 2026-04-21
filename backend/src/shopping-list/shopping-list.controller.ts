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

  @Get('week')
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.findWeek(date, user.userId);
  }

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

  @Delete('items/:id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.shoppingListService.removeItem(id, user.userId);
  }
}