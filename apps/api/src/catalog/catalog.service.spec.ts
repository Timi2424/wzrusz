import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let categories: jest.Mocked<Pick<Repository<Category>, 'createQueryBuilder' | 'findOne'>>;

  beforeEach(async () => {
    categories = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(Category),
          useValue: categories,
        },
      ],
    }).compile();

    service = module.get(CatalogService);
  });

  it('maps category summaries with decoration counts', async () => {
    const getMany = jest.fn().mockResolvedValue([
      {
        id: 'cat-1',
        name: 'Balony',
        slug: 'balony',
        decorationCount: 2,
      },
    ]);
    const orderBy = jest.fn().mockReturnThis();
    const addOrderBy = jest.fn().mockReturnThis();
    const loadRelationCountAndMap = jest.fn().mockReturnThis();

    categories.createQueryBuilder.mockReturnValue({
      loadRelationCountAndMap,
      orderBy,
      addOrderBy,
      getMany,
    } as never);

    await expect(service.listCategories()).resolves.toEqual([
      {
        id: 'cat-1',
        name: 'Balony',
        slug: 'balony',
        decorationCount: 2,
      },
    ]);
  });

  it('returns null when category slug is unknown', async () => {
    categories.findOne.mockResolvedValue(null);

    await expect(service.getCategoryBySlug('missing')).resolves.toBeNull();
  });

  it('returns sorted decorations for a category', async () => {
    categories.findOne.mockResolvedValue({
      id: 'cat-1',
      name: 'Balony',
      slug: 'balony',
      decorations: [
        {
          id: 'dec-b',
          name: 'Zestaw B',
          slug: 'zestaw-b',
          description: 'Opis B',
          imageUrl: null,
          stockQuantity: 4,
        },
        {
          id: 'dec-a',
          name: 'Zestaw A',
          slug: 'zestaw-a',
          description: 'Opis A',
          imageUrl: '/brand/logo-avatar.png',
          stockQuantity: 0,
        },
      ],
    } as Category);

    await expect(service.getCategoryBySlug('balony')).resolves.toEqual({
      id: 'cat-1',
      name: 'Balony',
      slug: 'balony',
      decorations: [
        {
          id: 'dec-a',
          name: 'Zestaw A',
          slug: 'zestaw-a',
          description: 'Opis A',
          imageUrl: '/brand/logo-avatar.png',
          stockQuantity: 0,
        },
        {
          id: 'dec-b',
          name: 'Zestaw B',
          slug: 'zestaw-b',
          description: 'Opis B',
          imageUrl: null,
          stockQuantity: 4,
        },
      ],
    });
  });
});
