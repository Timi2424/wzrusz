import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { Decoration } from '../database/entities/decoration.entity';
import {
  CategoryDetailDto,
  CategorySummaryDto,
  DecorationCardDto,
} from './catalog.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async listCategories(): Promise<CategorySummaryDto[]> {
    const rows = await this.categories
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.decorationCount',
        'category.decorations',
      )
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getMany();

    return rows.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      decorationCount:
        (category as Category & { decorationCount?: number }).decorationCount ??
        0,
    }));
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDetailDto | null> {
    const category = await this.categories.findOne({
      where: { slug },
      relations: { decorations: true },
    });

    if (!category) {
      return null;
    }

    const decorations = [...(category.decorations ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name, 'pl'),
    );

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      decorations: decorations.map(toDecorationCardDto),
    };
  }
}

function toDecorationCardDto(decoration: Decoration): DecorationCardDto {
  return {
    id: decoration.id,
    name: decoration.name,
    slug: decoration.slug,
    description: decoration.description,
    imageUrl: decoration.imageUrl,
    stockQuantity: decoration.stockQuantity,
  };
}
