import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquiryService } from './inquiry.service';

describe('InquiryService', () => {
  let service: InquiryService;
  let decorations: jest.Mocked<Pick<Repository<Decoration>, 'find'>>;
  let transaction: jest.Mock;

  beforeEach(async () => {
    transaction = jest.fn(async (work) =>
      work({
        create: (_entity: unknown, data: object) => ({ id: 'inq-1', ...data }),
        save: jest.fn(async (value: { id?: string; createdAt?: Date }) => {
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
          useValue: { createQueryBuilder: jest.fn() },
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

  it('creates inquiry when decorations exist', async () => {
    decorations.find.mockResolvedValue([{ id: 'dec-1' } as Decoration]);

    await expect(
      service.create({
        fullName: 'Anna Kowalska',
        email: 'anna@example.com',
        phone: '+48 600 000 000',
        eventStart: '2026-08-01T10:00:00.000Z',
        eventEnd: '2026-08-02T18:00:00.000Z',
        transportAddress: 'Poznań',
        needsInvoice: false,
        lineItems: [{ decorationId: 'dec-1', quantity: 2 }],
      }),
    ).resolves.toEqual({
      id: 'inq-1',
      status: 'submitted',
      createdAt: '2026-06-07T12:00:00.000Z',
    });

    expect(transaction).toHaveBeenCalled();
  });

  it('rejects empty line items', async () => {
    await expect(
      service.create({
        fullName: 'Anna',
        email: 'anna@example.com',
        eventStart: '2026-08-01T10:00:00.000Z',
        eventEnd: '2026-08-02T18:00:00.000Z',
        transportAddress: 'Poznań',
        needsInvoice: false,
        lineItems: [],
      }),
    ).rejects.toThrow('lineItems must contain at least one item');
  });
});
