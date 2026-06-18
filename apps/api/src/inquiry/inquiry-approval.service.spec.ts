import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { ScheduleEventLineItem } from '../database/entities/schedule-event-line-item.entity';
import { InquiryApprovalService } from './inquiry-approval.service';

describe('InquiryApprovalService', () => {
  let service: InquiryApprovalService;
  let inquiries: { findOne: jest.Mock };
  let scheduleLineItems: { createQueryBuilder: jest.Mock };
  let transaction: jest.Mock;

  const baseInquiry = {
    id: 'inq-1',
    fullName: 'Anna Kowalska',
    email: 'anna@example.com',
    eventStart: new Date('2026-08-01T10:00:00.000Z'),
    eventEnd: new Date('2026-08-02T18:00:00.000Z'),
    status: InquiryStatus.Submitted,
    lineItems: [
      {
        id: 'line-1',
        decorationId: 'dec-1',
        quantity: 2,
        sortOrder: 0,
        decoration: { id: 'dec-1', name: 'Girlanda', stockQuantity: 5 },
      },
    ],
  } as Inquiry;

  function mockOccupied(rows: Array<{ decorationId: string; quantity: string }>) {
    scheduleLineItems.createQueryBuilder.mockReturnValue({
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(rows),
    });
  }

  function mockTransactionDecoration(decoration: { id: string; stockQuantity: number }) {
    transaction.mockImplementation(async (work) =>
      work({
        create: (_entity: unknown, data: object) => ({ id: 'evt-1', ...data }),
        save: jest.fn(async (value: object) => value),
        findOneByOrFail: jest.fn(async () => decoration),
      }),
    );
  }

  beforeEach(async () => {
    transaction = jest.fn(async (work) =>
      work({
        create: (_entity: unknown, data: object) => ({ id: 'evt-1', ...data }),
        save: jest.fn(async (value: object) => value),
        findOneByOrFail: jest.fn(async () => ({ id: 'dec-1', stockQuantity: 5 })),
      }),
    );

    inquiries = {
      findOne: jest.fn().mockImplementation(async () => structuredClone(baseInquiry)),
    };
    scheduleLineItems = {
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryApprovalService,
        {
          provide: getRepositoryToken(Inquiry),
          useValue: inquiries,
        },
        {
          provide: getRepositoryToken(ScheduleEventLineItem),
          useValue: scheduleLineItems,
        },
        {
          provide: DataSource,
          useValue: { transaction },
        },
      ],
    }).compile();

    service = module.get(InquiryApprovalService);
  });

  it('reports availability for submitted inquiry', async () => {
    await expect(service.getAvailability('inq-1')).resolves.toEqual({
      inquiryId: 'inq-1',
      canApprove: true,
      items: [
        {
          lineItemId: 'line-1',
          decorationId: 'dec-1',
          decorationName: 'Girlanda',
          requestedQuantity: 2,
          availableQuantity: 5,
          status: 'ok',
        },
      ],
    });
  });

  it('reports shortage when overlapping schedule events consume stock', async () => {
    mockOccupied([{ decorationId: 'dec-1', quantity: '4' }]);

    await expect(service.getAvailability('inq-1')).resolves.toMatchObject({
      inquiryId: 'inq-1',
      canApprove: false,
      items: [
        {
          lineItemId: 'line-1',
          requestedQuantity: 2,
          availableQuantity: 1,
          status: 'shortage',
        },
      ],
    });
  });

  it('does not allow approve when inquiry is not submitted', async () => {
    inquiries.findOne.mockResolvedValue({
      ...baseInquiry,
      status: InquiryStatus.Approved,
    });

    await expect(service.getAvailability('inq-1')).resolves.toMatchObject({
      canApprove: false,
    });
  });

  it('approves inquiry and decrements stock in the transaction', async () => {
    const decoration = { id: 'dec-1', stockQuantity: 5 };
    mockTransactionDecoration(decoration);

    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 2 }],
      }),
    ).resolves.toEqual({
      inquiryId: 'inq-1',
      status: 'approved',
      scheduleEventId: 'evt-1',
    });

    expect(decoration.stockQuantity).toBe(3);
    expect(transaction).toHaveBeenCalled();
  });

  it('rejects approval when requested quantity exceeds available stock', async () => {
    inquiries.findOne.mockResolvedValue({
      ...baseInquiry,
      lineItems: [
        {
          ...baseInquiry.lineItems[0],
          quantity: 8,
          decoration: { id: 'dec-1', name: 'Girlanda', stockQuantity: 5 },
        },
      ],
    });

    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 8 }],
      }),
    ).rejects.toThrow('Requested quantities exceed availability');
  });

  it('rejects approval when transaction would drive stock below zero', async () => {
    const decoration = { id: 'dec-1', stockQuantity: 1 };
    mockTransactionDecoration(decoration);

    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 2 }],
      }),
    ).rejects.toThrow('Stock cannot go below zero');

    expect(decoration.stockQuantity).toBe(-1);
  });

  it('rejects approval when inquiry was already processed', async () => {
    inquiries.findOne.mockResolvedValue({
      ...baseInquiry,
      status: InquiryStatus.Approved,
    });

    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 2 }],
      }),
    ).rejects.toThrow('Inquiry was already processed');
  });

  it('rejects invalid approve payload', async () => {
    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'unknown-line', quantity: 1 }],
      }),
    ).rejects.toThrow('lineItems[].lineItemId is invalid');
  });
});
