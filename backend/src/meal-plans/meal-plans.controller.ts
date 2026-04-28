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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Meal Plans')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
/**
 * Controller responsable des routes du planning repas.
 *
 * Il permet d'ajouter un repas au planning, de récupérer la semaine
 * d'un utilisateur et de supprimer un élément du planning.
 */
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post()
  @ApiOperation({
    summary: 'Ajouter une recette au planning',
    description:
      'Ajoute une recette locale ou externe au planning de la semaine.',
  })
  @ApiBody({ type: CreateMealPlanDto })
  @ApiResponse({ status: 201, description: 'Repas ajouté au planning.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou doublon.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  create(
    @Body() createMealPlanDto: CreateMealPlanDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.create(createMealPlanDto, user.userId);
  }

  @Get('week')
  @ApiOperation({
    summary: 'Récupérer le planning de la semaine',
    description: 'Retourne les repas planifiés du lundi au dimanche.',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    example: '2026-04-21',
    description: 'Date utilisée pour calculer la semaine.',
  })
  @ApiResponse({ status: 200, description: 'Planning hebdomadaire retourné.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  findWeek(
    @Query('date') date: string,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.findWeek(date, user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un repas du planning',
    description:
      'Supprime un élément du planning appartenant à l’utilisateur connecté.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant du meal plan.',
  })
  @ApiResponse({ status: 200, description: 'Meal plan supprimé.' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié.' })
  @ApiResponse({ status: 404, description: 'Meal plan introuvable.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.remove(id, user.userId);
  }
}
