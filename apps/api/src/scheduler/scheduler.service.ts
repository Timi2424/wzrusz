import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEvent } from '../database/entities/schedule-event.entity';
import {
  SchedulerEventDto,
  SchedulerRangeFiltersDto,
} from './scheduler.dto';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(ScheduleEvent)
    private readonly events: Repository<ScheduleEvent>,
  ) {}

  async listEventsInRange(
    filters: SchedulerRangeFiltersDto,
  ): Promise<SchedulerEventDto[]> {
    this.assertValidRange(filters.from, filters.to);

    const rows = await this.events
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.lineItems', 'lineItem')
      .leftJoinAndSelect('lineItem.decoration', 'decoration')
      .where('event.startsAt < :to', { to: filters.to })
      .andWhere('event.endsAt > :from', { from: filters.from })
      .orderBy('event.startsAt', 'ASC')
      .addOrderBy('decoration.name', 'ASC')
      .getMany();

    return rows.map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      inquiryId: event.inquiryId,
      occupiedDecorations: [...(event.lineItems ?? [])]
        .sort((a, b) =>
          (a.decoration?.name ?? '').localeCompare(b.decoration?.name ?? '', 'pl'),
        )
        .map((line) => ({
          decorationId: line.decorationId,
          decorationName: line.decoration?.name ?? 'Usunięta dekoracja',
          quantity: line.quantity,
        })),
    }));
  }

  private assertValidRange(from: string, to: string): void {
    if (!from || !to) {
      throw new BadRequestException('from and to are required');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('from and to must be valid dates');
    }

    if (toDate <= fromDate) {
      throw new BadRequestException('to must be after from');
    }
  }
}
