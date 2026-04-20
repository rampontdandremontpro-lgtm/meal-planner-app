import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @CurrentUser() user: { userId: number; email: string },
  ) {
    return this.recipesService.create(createRecipeDto, user.userId);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.recipesService.findAll(search);
  }

  @Get('external/:id')
  findExternalById(@Param('id') id: string) {
    return this.recipesService.findExternalById(id);
  }

  @Get('local/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }
}