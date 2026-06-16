import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import {
  AdminCategoryDto,
  AdminDecorationDto,
  CreateCategoryDto,
  CreateDecorationDto,
  UpdateCategoryDto,
  UpdateDecorationDto,
} from './admin-catalog.dto';
import { AdminCatalogService } from './admin-catalog.service';

@Controller('admin/catalog')
@UseGuards(AdminAuthGuard)
export class AdminCatalogController {
  constructor(private readonly catalog: AdminCatalogService) {}

  @Get('categories')
  listCategories(): Promise<AdminCategoryDto[]> {
    return this.catalog.listCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string): Promise<AdminCategoryDto> {
    return this.catalog.getCategory(id);
  }

  @Post('categories')
  createCategory(@Body() body: CreateCategoryDto): Promise<AdminCategoryDto> {
    return this.catalog.createCategory(body);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<AdminCategoryDto> {
    return this.catalog.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.catalog.deleteCategory(id);
  }

  @Get('categories/:categoryId/decorations')
  listDecorations(
    @Param('categoryId') categoryId: string,
  ): Promise<AdminDecorationDto[]> {
    return this.catalog.listDecorations(categoryId);
  }

  @Get('decorations/:id')
  getDecoration(@Param('id') id: string): Promise<AdminDecorationDto> {
    return this.catalog.getDecoration(id);
  }

  @Post('decorations')
  createDecoration(
    @Body() body: CreateDecorationDto,
  ): Promise<AdminDecorationDto> {
    return this.catalog.createDecoration(body);
  }

  @Patch('decorations/:id')
  updateDecoration(
    @Param('id') id: string,
    @Body() body: UpdateDecorationDto,
  ): Promise<AdminDecorationDto> {
    return this.catalog.updateDecoration(id, body);
  }

  @Delete('decorations/:id')
  deleteDecoration(@Param('id') id: string): Promise<void> {
    return this.catalog.deleteDecoration(id);
  }
}
