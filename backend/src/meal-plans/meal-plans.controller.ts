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
   * Ajoute un repas au planning de l'utilisateur connecté.
   *
   * Cette route permet de créer une entrée dans le planning hebdomadaire
   * de l'utilisateur authentifié. Le repas peut être lié soit à une recette
   * locale appartenant à l'utilisateur, soit à une recette externe.
   *
   * Règles métier :
   * - un seul repas est autorisé par utilisateur, date et type de repas ;
   * - une recette locale doit appartenir à l'utilisateur connecté ;
   * - une recette externe doit fournir un identifiant externe valide.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route POST /meal-plans
   * @access Private (JWT)
   * @param createMealPlanDto Données du repas à ajouter au planning.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Le meal plan créé et formaté pour la réponse API.
   *
   * @throws {NotFoundException} Si l'utilisateur ou la recette demandée est introuvable.
   * @throws {BadRequestException} Si les données sont invalides ou incomplètes,
   * ou si un doublon existe déjà pour cette date et ce type de repas.
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
   * Cette route calcule la semaine à partir de la date fournie en paramètre
   * puis renvoie tous les repas enregistrés par l'utilisateur pour cette période.
   *
   * Règles métier :
   * - seuls les meal plans du user connecté sont retournés ;
   * - la semaine est calculée du lundi au dimanche ;
   * - les recettes locales et externes sont renvoyées dans un format harmonisé.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route GET /meal-plans/week?date=YYYY-MM-DD
   * @access Private (JWT)
   * @param date Date de référence permettant de calculer la semaine.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Le planning complet de la semaine avec ses bornes et ses items.
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
   * Cette route permet de retirer définitivement une entrée du planning
   * hebdomadaire de l'utilisateur authentifié.
   *
   * Règles métier :
   * - un utilisateur ne peut supprimer que ses propres meal plans ;
   * - si l'élément n'existe pas ou n'appartient pas au user, il est considéré
   *   comme introuvable.
   *
   * Sécurité :
   * - route protégée par JWT ;
   * - l'utilisateur doit être authentifié.
   *
   * @route DELETE /meal-plans/:id
   * @access Private (JWT)
   * @param id Identifiant du meal plan à supprimer.
   * @param user Utilisateur authentifié extrait du token JWT.
   * @returns Un message de confirmation de suppression.
   *
   * @throws {NotFoundException} Si le meal plan est introuvable
   * ou n'appartient pas à l'utilisateur connecté.
   */
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.mealPlansService.remove(id, user.userId);
  }
}