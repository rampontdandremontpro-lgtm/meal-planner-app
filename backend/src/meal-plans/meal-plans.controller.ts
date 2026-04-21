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

  /**
   * Ajoute une recette au planning de l'utilisateur connecté.
   *
   * @route POST /meal-plans
   * @access Private (JWT)
   * @param createMealPlanDto Données du repas à ajouter
   * @param user Utilisateur connecté
   * @returns Le meal plan créé
   */
  @Post()
  create(
    @Body() createMealPlanDto: CreateMealPlanDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.create(createMealPlanDto, user.userId);
  }

  /**
   * Récupère le planning hebdomadaire de l'utilisateur connecté.
   *
   * @route GET /meal-plans/week?date=YYYY-MM-DD
   * @access Private (JWT)
   * @param date Date de référence pour calculer la semaine
   * @param user Utilisateur connecté
   * @returns Le planning de la semaine
   */
  @Get('week')
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.findWeek(date, user.userId);
  }

  /**
   * Supprime un élément du planning appartenant à l'utilisateur connecté.
   *
   * @route DELETE /meal-plans/:id
   * @access Private (JWT)
   * @param id Identifiant du meal plan
   * @param user Utilisateur connecté
   * @returns Message de confirmation
   */
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.remove(id, user.userId);
  }
}