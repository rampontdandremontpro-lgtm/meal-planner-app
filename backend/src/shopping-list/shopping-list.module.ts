import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingItem } from './entities/shopping-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingItem])],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
  exports: [TypeOrmModule, ShoppingListService],
})
export class ShoppingListModule {}