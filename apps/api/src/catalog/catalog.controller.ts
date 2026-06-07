import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CategoryDetailDto, CategorySummaryDto } from './catalog.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  listCategories(): Promise<CategorySummaryDto[]> {
    return this.catalog.listCategories();
  }

  @Get('categories/:slug')
  async getCategory(@Param('slug') slug: string): Promise<CategoryDetailDto> {
    const category = await this.catalog.getCategoryBySlug(slug);

    if (!category) {
      throw new NotFoundException(`Category not found: ${slug}`);
    }

    return category;
  }
}
