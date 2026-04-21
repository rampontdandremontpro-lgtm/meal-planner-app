import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post()
  create(
    @Body() createMealPlanDto: CreateMealPlanDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.create(createMealPlanDto, user.userId);
  }

  @Get('week')
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.findWeek(date, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.remove(id, user.userId);
  }
}