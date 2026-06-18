import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquiryService } from './inquiry.service';

describe('InquiryService', () => {
  let service: InquiryService;
  let decorations: jest.Mocked<Pick<Repository<Decoration>, 'find'>>;
  let inquiries: jest.Mocked<Pick<Repository<Inquiry>, 'findOne' | 'createQueryBuilder'>>;
  let transaction: jest.Mock;
  let savedLineItems: InquiryLineItem[];

  const createPayload = {
    fullName: 'Anna Kowalska',
    email: 'anna@example.com',
    phone: '+48 600 000 000',
    eventStart: '2026-08-01T10:00:00.000Z',
    eventEnd: '2026-08-02T18:00:00.000Z',
    transportAddress: 'Poznań',
    needsInvoice: false,
    lineItems: [{ decorationId: 'dec-1', quantity: 2 }],
  };

  beforeEach(async () => {
    savedLineItems = [];

    transaction = jest.fn(async (work) =>
      work({
        create: (_entity: unknown, data: object) => ({ id: 'inq-1', ...data }),
        save: jest.fn(async (value: Inquiry | InquiryLineItem[]) => {
          if (Array.isArray(value)) {
            savedLineItems.push(...value);
            return value;
          }

          if (!value.createdAt) {
            value.createdAt = new Date('2026-06-07T12:00:00.000Z');
          }
          return value;
        }),
      }),
    );

    decorations = {
      find: jest.fn(),
    };

    inquiries = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryService,
        {
          provide: InquiryNotificationService,
          useValue: {
            notifyAdminNewInquiry: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Inquiry),
          useValue: inquiries,
        },
        {
          provide: getRepositoryToken(Decoration),
          useValue: decorations,
        },
        {
          provide: DataSource,
          useValue: { transaction },
        },
      ],
    }).compile();

    service = module.get(InquiryService);
  });

  describe('create', () => {
    it('creates inquiry when decorations exist', async () => {
      decorations.find.mockResolvedValue([{ id: 'dec-1' } as Decoration]);

      await expect(service.create(createPayload)).resolves.toEqual({
        id: 'inq-1',
        status: 'submitted',
        createdAt: '2026-06-07T12:00:00.000Z',
      });

      expect(transaction).toHaveBeenCalled();
      expect(savedLineItems).toEqual([
        expect.objectContaining({
          inquiryId: 'inq-1',
          decorationId: 'dec-1',
          quantity: 2,
          sortOrder: 0,
        }),
      ]);
    });

    it('persists every line item with sort order for multi-item inquiries', async () => {
      decorations.find.mockResolvedValue([
        { id: 'dec-1' } as Decoration,
        { id: 'dec-2' } as Decoration,
      ]);

      await service.create({
        ...createPayload,
        lineItems: [
          { decorationId: 'dec-1', quantity: 2 },
          { decorationId: 'dec-2', quantity: 1 },
        ],
      });

      expect(savedLineItems).toHaveLength(2);
      expect(savedLineItems.map((item) => item.sortOrder)).toEqual([0, 1]);
      expect(savedLineItems.map((item) => item.decorationId)).toEqual([
        'dec-1',
        'dec-2',
      ]);
    });

    it('rejects empty line items', async () => {
      await expect(
        service.create({
          ...createPayload,
          lineItems: [],
        }),
      ).rejects.toThrow('lineItems must contain at least one item');
    });

    it('rejects unknown decoration ids', async () => {
      decorations.find.mockResolvedValue([{ id: 'dec-1' } as Decoration]);

      await expect(
        service.create({
          ...createPayload,
          lineItems: [
            { decorationId: 'dec-1', quantity: 1 },
            { decorationId: 'missing', quantity: 1 },
          ],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(transaction).not.toHaveBeenCalled();
    });
  });

  describe('getDetail', () => {
    it('returns line items sorted by sortOrder', async () => {
      inquiries.findOne.mockResolvedValue({
        id: 'inq-1',
        fullName: 'Anna',
        email: 'anna@example.com',
        phone: null,
        eventStart: new Date('2026-08-01T10:00:00.000Z'),
        eventEnd: new Date('2026-08-02T18:00:00.000Z'),
        transportAddress: 'Poznań',
        needsInvoice: false,
        invoiceNotes: null,
        status: InquiryStatus.Submitted,
        successEmailSentAt: null,
        createdAt: new Date('2026-06-07T12:00:00.000Z'),
        lineItems: [
          {
            id: 'line-2',
            decorationId: 'dec-2',
            quantity: 1,
            sortOrder: 1,
            decoration: { name: 'Balony' },
          },
          {
            id: 'line-1',
            decorationId: 'dec-1',
            quantity: 3,
            sortOrder: 0,
            decoration: { name: 'Girlanda' },
          },
        ],
      } as Inquiry);

      await expect(service.getDetail('inq-1')).resolves.toMatchObject({
        id: 'inq-1',
        lineItems: [
          {
            id: 'line-1',
            decorationName: 'Girlanda',
            quantity: 3,
            sortOrder: 0,
          },
          {
            id: 'line-2',
            decorationName: 'Balony',
            quantity: 1,
            sortOrder: 1,
          },
        ],
      });
    });

    it('throws when inquiry does not exist', async () => {
      inquiries.findOne.mockResolvedValue(null);

      await expect(service.getDetail('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
