import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { ScheduleEventLineItem } from '../database/entities/schedule-event-line-item.entity';
import { ScheduleEvent } from '../database/entities/schedule-event.entity';
import {
  ApproveInquiryDto,
  ApproveInquiryResponseDto,
  InquiryAvailabilityDto,
} from './inquiry-approval.dto';

@Injectable()
export class InquiryApprovalService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
    @InjectRepository(ScheduleEventLineItem)
    private readonly scheduleLineItems: Repository<ScheduleEventLineItem>,
    private readonly dataSource: DataSource,
  ) {}

  async getAvailability(id: string): Promise<InquiryAvailabilityDto> {
    const inquiry = await this.findInquiryOrThrow(id);
    const items = await this.buildAvailabilityItems(inquiry);

    return {
      inquiryId: inquiry.id,
      canApprove:
        inquiry.status === InquiryStatus.Submitted &&
        items.every((item) => item.status === 'ok'),
      items,
    };
  }

  async approve(
    id: string,
    dto: ApproveInquiryDto,
  ): Promise<ApproveInquiryResponseDto> {
    const inquiry = await this.findInquiryOrThrow(id);

    if (inquiry.status !== InquiryStatus.Submitted) {
      throw new ConflictException('Inquiry was already processed');
    }

    const quantities = this.parseApprovePayload(inquiry, dto);
    const availability = await this.buildAvailabilityItems(inquiry, quantities);

    if (availability.some((item) => item.status === 'shortage')) {
      throw new ConflictException('Requested quantities exceed availability');
    }

    const scheduleEventId = await this.dataSource.transaction(async (manager) => {
      const event = manager.create(ScheduleEvent, {
        title: `${inquiry.fullName} — rezerwacja`,
        startsAt: inquiry.eventStart,
        endsAt: inquiry.eventEnd,
        inquiryId: inquiry.id,
      });
      await manager.save(event);

      for (const line of inquiry.lineItems) {
        const quantity = quantities.get(line.id)!;
        await manager.save(
          manager.create(ScheduleEventLineItem, {
            scheduleEventId: event.id,
            decorationId: line.decorationId,
            quantity,
          }),
        );

        const decoration = await manager.findOneByOrFail(Decoration, {
          id: line.decorationId,
        });
        decoration.stockQuantity -= quantity;
        if (decoration.stockQuantity < 0) {
          throw new ConflictException('Stock cannot go below zero');
        }
        await manager.save(decoration);
      }

      inquiry.status = InquiryStatus.Approved;
      await manager.save(inquiry);

      return event.id;
    });

    return {
      inquiryId: inquiry.id,
      status: 'approved',
      scheduleEventId,
    };
  }

  private async findInquiryOrThrow(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiries.findOne({
      where: { id },
      relations: {
        lineItems: {
          decoration: true,
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry was not found');
    }

    return inquiry;
  }

  private parseApprovePayload(
    inquiry: Inquiry,
    dto: ApproveInquiryDto,
  ): Map<string, number> {
    if (!Array.isArray(dto.lineItems) || dto.lineItems.length === 0) {
      throw new BadRequestException('lineItems must contain at least one item');
    }

    const knownIds = new Set(inquiry.lineItems.map((line) => line.id));
    const quantities = new Map<string, number>();

    for (const item of dto.lineItems) {
      if (!item.lineItemId || !knownIds.has(item.lineItemId)) {
        throw new BadRequestException('lineItems[].lineItemId is invalid');
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestException('lineItems[].quantity must be >= 1');
      }

      quantities.set(item.lineItemId, item.quantity);
    }

    if (quantities.size !== inquiry.lineItems.length) {
      throw new BadRequestException('lineItems must include every inquiry item');
    }

    return quantities;
  }

  private async buildAvailabilityItems(
    inquiry: Inquiry,
    quantities?: Map<string, number>,
  ) {
    const occupiedByDecoration = await this.loadOccupiedQuantities(inquiry);

    return [...inquiry.lineItems]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((line) => {
        const requestedQuantity = quantities?.get(line.id) ?? line.quantity;
        const occupied = occupiedByDecoration.get(line.decorationId) ?? 0;
        const stock = line.decoration?.stockQuantity ?? 0;
        const availableQuantity = Math.max(stock - occupied, 0);

        return {
          lineItemId: line.id,
          decorationId: line.decorationId,
          decorationName: line.decoration?.name ?? 'Usunięta dekoracja',
          requestedQuantity,
          availableQuantity,
          status:
            requestedQuantity <= availableQuantity
              ? ('ok' as const)
              : ('shortage' as const),
        };
      });
  }

  private async loadOccupiedQuantities(
    inquiry: Inquiry,
  ): Promise<Map<string, number>> {
    const rows = await this.scheduleLineItems
      .createQueryBuilder('line')
      .innerJoin('line.scheduleEvent', 'event')
      .select('line.decorationId', 'decorationId')
      .addSelect('SUM(line.quantity)', 'quantity')
      .where('event.startsAt < :eventEnd', { eventEnd: inquiry.eventEnd })
      .andWhere('event.endsAt > :eventStart', { eventStart: inquiry.eventStart })
      .groupBy('line.decorationId')
      .getRawMany<{ decorationId: string; quantity: string }>();

    return new Map(
      rows.map((row) => [row.decorationId, Number.parseInt(row.quantity, 10)]),
    );
  }
}
