import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { Decoration } from '../database/entities/decoration.entity';
import { AdminCatalogService } from './admin-catalog.service';

describe('AdminCatalogService', () => {
  let service: AdminCatalogService;
  let categories: {
    createQueryBuilder: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    remove: jest.Mock;
  };
  let decorations: {
    count: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    categories = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn((value?: object) => value as Category),
      remove: jest.fn(),
    };
    decorations = {
      count: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn((value?: object) => value as Decoration),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCatalogService,
        {
          provide: getRepositoryToken(Category),
          useValue: categories,
        },
        {
          provide: getRepositoryToken(Decoration),
          useValue: decorations,
        },
      ],
    }).compile();

    service = module.get(AdminCatalogService);
  });

  it('creates category with generated slug', async () => {
    categories.save.mockResolvedValue({
      id: 'cat-1',
      name: 'Balony',
      slug: 'balony',
      sortOrder: 0,
    } as Category);

    await expect(
      service.createCategory({ name: 'Balony' }),
    ).resolves.toEqual({
      id: 'cat-1',
      name: 'Balony',
      slug: 'balony',
      sortOrder: 0,
      decorationCount: 0,
    });
  });

  it('rejects deleting category with decorations', async () => {
    categories.findOne.mockResolvedValue({
      id: 'cat-1',
      name: 'Balony',
      slug: 'balony',
      sortOrder: 0,
    } as Category);
    decorations.count.mockResolvedValue(2);

    await expect(service.deleteCategory('cat-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('updates decoration stock', async () => {
    const base = {
      id: 'dec-1',
      categoryId: 'cat-1',
      category: { name: 'Balony' },
      name: 'Girlanda',
      slug: 'girlanda',
      description: 'Opis',
      imageUrl: null,
      stockQuantity: 2,
    } as Decoration;

    decorations.findOne
      .mockResolvedValueOnce(base)
      .mockResolvedValueOnce({ ...base, stockQuantity: 7 });
    decorations.save.mockImplementation(async (value) => value as Decoration);

    await expect(
      service.updateDecoration('dec-1', { stockQuantity: 7 }),
    ).resolves.toMatchObject({
      id: 'dec-1',
      stockQuantity: 7,
    });
  });

  it('throws when decoration is missing', async () => {
    decorations.findOne.mockResolvedValue(null);

    await expect(service.getDecoration('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
