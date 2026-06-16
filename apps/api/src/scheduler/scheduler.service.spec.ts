import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ScheduleEvent } from '../database/entities/schedule-event.entity';
import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let events: { createQueryBuilder: jest.Mock };

  beforeEach(async () => {
    events = { createQueryBuilder: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: getRepositoryToken(ScheduleEvent),
          useValue: events,
        },
      ],
    }).compile();

    service = module.get(SchedulerService);
  });

  it('maps overlapping events with occupied decorations', async () => {
    const getMany = jest.fn().mockResolvedValue([
      {
        id: 'evt-1',
        title: 'Wesele',
        startsAt: new Date('2026-07-15T08:00:00.000Z'),
        endsAt: new Date('2026-07-16T16:00:00.000Z'),
        inquiryId: null,
        lineItems: [
          {
            decorationId: 'dec-b',
            quantity: 1,
            decoration: { name: 'Łuk balonowy' },
          },
          {
            decorationId: 'dec-a',
            quantity: 2,
            decoration: { name: 'Girlanda' },
          },
        ],
      },
    ]);

    const chain = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany,
    };
    events.createQueryBuilder.mockReturnValue(chain);

    await expect(
      service.listEventsInRange({
        from: '2026-07-01T00:00:00.000Z',
        to: '2026-08-01T00:00:00.000Z',
      }),
    ).resolves.toEqual([
      {
        id: 'evt-1',
        title: 'Wesele',
        startsAt: '2026-07-15T08:00:00.000Z',
        endsAt: '2026-07-16T16:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [
          {
            decorationId: 'dec-a',
            decorationName: 'Girlanda',
            quantity: 2,
          },
          {
            decorationId: 'dec-b',
            decorationName: 'Łuk balonowy',
            quantity: 1,
          },
        ],
      },
    ]);
  });

  it('rejects invalid date range', async () => {
    await expect(
      service.listEventsInRange({
        from: 'invalid',
        to: '2026-08-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
