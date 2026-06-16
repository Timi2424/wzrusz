import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { ScheduleEventLineItem } from '../database/entities/schedule-event-line-item.entity';
import { InquiryApprovalService } from './inquiry-approval.service';

describe('InquiryApprovalService', () => {
  let service: InquiryApprovalService;
  let inquiries: { findOne: jest.Mock };
  let scheduleLineItems: { createQueryBuilder: jest.Mock };
  let transaction: jest.Mock;

  const inquiry = {
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

  beforeEach(async () => {
    transaction = jest.fn(async (work) =>
      work({
        create: (_entity: unknown, data: object) => ({ id: 'evt-1', ...data }),
        save: jest.fn(async (value: object) => value),
        findOneByOrFail: jest.fn(async () => ({ id: 'dec-1', stockQuantity: 5 })),
      }),
    );

    inquiries = { findOne: jest.fn().mockResolvedValue(inquiry) };
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

  it('approves inquiry and creates schedule event', async () => {
    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 2 }],
      }),
    ).resolves.toEqual({
      inquiryId: 'inq-1',
      status: 'approved',
      scheduleEventId: 'evt-1',
    });

    expect(transaction).toHaveBeenCalled();
  });

  it('rejects approval when stock is insufficient', async () => {
    inquiries.findOne.mockResolvedValue({
      ...inquiry,
      lineItems: [
        {
          ...inquiry.lineItems[0],
          quantity: 8,
          decoration: { id: 'dec-1', name: 'Girlanda', stockQuantity: 5 },
        },
      ],
    });

    await expect(
      service.approve('inq-1', {
        lineItems: [{ lineItemId: 'line-1', quantity: 8 }],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
