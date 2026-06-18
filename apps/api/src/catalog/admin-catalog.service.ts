import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  assertDecorationImageFile,
  decorationImageKey,
} from '../media/decoration-image';
import { getMediaConfig } from '../media/media.config';
import { MEDIA_STORAGE, MediaStorage } from '../media/media.types';
import { Category } from '../database/entities/category.entity';
import { Decoration } from '../database/entities/decoration.entity';
import {
  AdminCategoryDto,
  AdminDecorationDto,
  CreateCategoryDto,
  CreateDecorationDto,
  UpdateCategoryDto,
  UpdateDecorationDto,
} from './admin-catalog.dto';
import { slugify } from './slugify';

@Injectable()
export class AdminCatalogService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Decoration)
    private readonly decorations: Repository<Decoration>,
    @Inject(MEDIA_STORAGE)
    private readonly mediaStorage: MediaStorage,
  ) {}

  async listCategories(): Promise<AdminCategoryDto[]> {
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
      sortOrder: category.sortOrder,
      decorationCount:
        (category as Category & { decorationCount?: number }).decorationCount ??
        0,
    }));
  }

  async getCategory(id: string): Promise<AdminCategoryDto> {
    const category = await this.findCategoryOrThrow(id);
    const decorationCount = await this.decorations.count({
      where: { categoryId: id },
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      sortOrder: category.sortOrder,
      decorationCount,
    };
  }

  async createCategory(dto: CreateCategoryDto): Promise<AdminCategoryDto> {
    const name = this.requireTrimmed(dto.name, 'name');
    const slug = this.resolveSlug(name, dto.slug);

    try {
      const saved = await this.categories.save(
        this.categories.create({
          name,
          slug,
          sortOrder: dto.sortOrder ?? 0,
        }),
      );

      return {
        id: saved.id,
        name: saved.name,
        slug: saved.slug,
        sortOrder: saved.sortOrder,
        decorationCount: 0,
      };
    } catch (error) {
      this.rethrowUniqueViolation(error, 'category slug');
      throw error;
    }
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<AdminCategoryDto> {
    const category = await this.findCategoryOrThrow(id);
    const nextName =
      dto.name !== undefined ? this.requireTrimmed(dto.name, 'name') : category.name;
    const nextSlug =
      dto.slug !== undefined
        ? this.resolveSlug(nextName, dto.slug)
        : dto.name !== undefined
          ? this.resolveSlug(nextName)
          : category.slug;

    try {
      const saved = await this.categories.save({
        ...category,
        name: nextName,
        slug: nextSlug,
        sortOrder: dto.sortOrder ?? category.sortOrder,
      });

      const decorationCount = await this.decorations.count({
        where: { categoryId: id },
      });

      return {
        id: saved.id,
        name: saved.name,
        slug: saved.slug,
        sortOrder: saved.sortOrder,
        decorationCount,
      };
    } catch (error) {
      this.rethrowUniqueViolation(error, 'category slug');
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.findCategoryOrThrow(id);
    const decorationCount = await this.decorations.count({
      where: { categoryId: id },
    });

    if (decorationCount > 0) {
      throw new ConflictException(
        'Cannot delete category while it still has decorations',
      );
    }

    await this.categories.remove(category);
  }

  async listDecorations(categoryId: string): Promise<AdminDecorationDto[]> {
    await this.findCategoryOrThrow(categoryId);

    const rows = await this.decorations.find({
      where: { categoryId },
      relations: { category: true },
      order: { name: 'ASC' },
    });

    return rows.map((row) => this.toDecorationDto(row));
  }

  async getDecoration(id: string): Promise<AdminDecorationDto> {
    const decoration = await this.findDecorationOrThrow(id);
    return this.toDecorationDto(decoration);
  }

  async createDecoration(dto: CreateDecorationDto): Promise<AdminDecorationDto> {
    const category = await this.findCategoryOrThrow(dto.categoryId);
    const name = this.requireTrimmed(dto.name, 'name');
    const slug = this.resolveSlug(name, dto.slug);
    const stockQuantity = this.normalizeStockQuantity(dto.stockQuantity);

    try {
      const saved = await this.decorations.save(
        this.decorations.create({
          categoryId: category.id,
          name,
          slug,
          description: dto.description?.trim() ?? '',
          imageUrl: this.normalizeImageUrl(dto.imageUrl),
          stockQuantity,
        }),
      );

      const withCategory = await this.findDecorationOrThrow(saved.id);
      return this.toDecorationDto(withCategory);
    } catch (error) {
      this.rethrowUniqueViolation(error, 'decoration slug');
      throw error;
    }
  }

  async updateDecoration(
    id: string,
    dto: UpdateDecorationDto,
  ): Promise<AdminDecorationDto> {
    const decoration = await this.findDecorationOrThrow(id);
    const nextName =
      dto.name !== undefined
        ? this.requireTrimmed(dto.name, 'name')
        : decoration.name;
    const nextSlug =
      dto.slug !== undefined
        ? this.resolveSlug(nextName, dto.slug)
        : dto.name !== undefined
          ? this.resolveSlug(nextName)
          : decoration.slug;

    if (dto.categoryId && dto.categoryId !== decoration.categoryId) {
      await this.findCategoryOrThrow(dto.categoryId);
    }

    try {
      const saved = await this.decorations.save({
        ...decoration,
        categoryId: dto.categoryId ?? decoration.categoryId,
        name: nextName,
        slug: nextSlug,
        description:
          dto.description !== undefined
            ? dto.description.trim()
            : decoration.description,
        imageUrl:
          dto.imageUrl !== undefined
            ? this.normalizeImageUrl(dto.imageUrl)
            : decoration.imageUrl,
        stockQuantity:
          dto.stockQuantity !== undefined
            ? this.normalizeStockQuantity(dto.stockQuantity)
            : decoration.stockQuantity,
      });

      const withCategory = await this.findDecorationOrThrow(saved.id);
      return this.toDecorationDto(withCategory);
    } catch (error) {
      this.rethrowUniqueViolation(error, 'decoration slug');
      throw error;
    }
  }

  async deleteDecoration(id: string): Promise<void> {
    const decoration = await this.findDecorationOrThrow(id);
    await this.decorations.remove(decoration);
  }

  async uploadDecorationImage(
    id: string,
    file: { mimetype: string; size: number; buffer: Buffer },
  ): Promise<AdminDecorationDto> {
    assertDecorationImageFile(file);
    const decoration = await this.findDecorationOrThrow(id);
    const mediaConfig = getMediaConfig();
    const key = decorationImageKey(
      mediaConfig.prefix,
      decoration.id,
      file.mimetype,
    );

    const uploaded = await this.mediaStorage.upload({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    decoration.imageUrl = uploaded.url;
    const saved = await this.decorations.save(decoration);
    return this.toDecorationDto(saved);
  }

  private async findCategoryOrThrow(id: string): Promise<Category> {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category was not found');
    }
    return category;
  }

  private async findDecorationOrThrow(id: string): Promise<Decoration> {
    const decoration = await this.decorations.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!decoration) {
      throw new NotFoundException('Decoration was not found');
    }
    return decoration;
  }

  private toDecorationDto(decoration: Decoration): AdminDecorationDto {
    return {
      id: decoration.id,
      categoryId: decoration.categoryId,
      categoryName: decoration.category?.name ?? 'Nieznana kategoria',
      name: decoration.name,
      slug: decoration.slug,
      description: decoration.description,
      imageUrl: decoration.imageUrl,
      stockQuantity: decoration.stockQuantity,
    };
  }

  private requireTrimmed(value: string, field: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException(`${field} is required`);
    }
    return trimmed;
  }

  private resolveSlug(name: string, explicit?: string): string {
    const source = explicit?.trim() || name;
    const slug = slugify(source);
    if (!slug) {
      throw new BadRequestException('slug could not be generated');
    }
    return slug;
  }

  private normalizeStockQuantity(value: number | undefined): number {
    if (value === undefined) {
      return 0;
    }
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException('stockQuantity must be a non-negative integer');
    }
    return value;
  }

  private normalizeImageUrl(value: string | null | undefined): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private rethrowUniqueViolation(error: unknown, field: string): void {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } }).driverError
        ?.code === '23505'
    ) {
      throw new ConflictException(`${field} must be unique`);
    }
  }
}
