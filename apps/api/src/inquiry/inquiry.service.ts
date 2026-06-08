import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import {
  CreateInquiryDto,
  CreateInquiryResponseDto,
  InquirySummaryDto,
} from './inquiry.dto';
import { InquiryNotificationService } from './inquiry-notification.service';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
    @InjectRepository(Decoration)
    private readonly decorations: Repository<Decoration>,
    private readonly dataSource: DataSource,
    private readonly notifications: InquiryNotificationService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<CreateInquiryResponseDto> {
    this.assertCreatePayload(dto);

    const decorationIds = dto.lineItems.map((item) => item.decorationId);
    const knownDecorations = await this.decorations.find({
      where: { id: In(decorationIds) },
      select: ['id'],
    });

    if (knownDecorations.length !== decorationIds.length) {
      throw new NotFoundException('One or more decorations were not found');
    }

    const saved = await this.dataSource.transaction(async (manager) => {
      const inquiry = manager.create(Inquiry, {
        fullName: dto.fullName.trim(),
        email: dto.email.trim(),
        phone: dto.phone?.trim() || null,
        eventStart: new Date(dto.eventStart),
        eventEnd: new Date(dto.eventEnd),
        transportAddress: dto.transportAddress.trim(),
        needsInvoice: dto.needsInvoice,
        invoiceNotes: dto.needsInvoice ? dto.invoiceNotes?.trim() || null : null,
        status: InquiryStatus.Submitted,
      });

      await manager.save(inquiry);

      const lineItems = dto.lineItems.map((item, index) =>
        manager.create(InquiryLineItem, {
          inquiryId: inquiry.id,
          decorationId: item.decorationId,
          quantity: item.quantity,
          sortOrder: index,
        }),
      );

      await manager.save(lineItems);

      return inquiry;
    });

    this.notifications.notifyAdminNewInquiry(saved.id, dto);

    return {
      id: saved.id,
      status: 'submitted',
      createdAt: saved.createdAt.toISOString(),
    };
  }

  async listSummaries(): Promise<InquirySummaryDto[]> {
    const rows = await this.inquiries
      .createQueryBuilder('inquiry')
      .loadRelationCountAndMap('inquiry.lineItemCount', 'inquiry.lineItems')
      .orderBy('inquiry.createdAt', 'DESC')
      .getMany();

    return rows.map((row) => ({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      eventStart: row.eventStart.toISOString(),
      eventEnd: row.eventEnd.toISOString(),
      status: 'submitted',
      createdAt: row.createdAt.toISOString(),
      lineItemCount:
        (row as Inquiry & { lineItemCount?: number }).lineItemCount ?? 0,
    }));
  }

  private assertCreatePayload(dto: CreateInquiryDto): void {
    if (!dto.fullName?.trim()) {
      throw new BadRequestException('fullName is required');
    }

    if (!dto.email?.trim() || !dto.email.includes('@')) {
      throw new BadRequestException('email is invalid');
    }

    if (!dto.transportAddress?.trim()) {
      throw new BadRequestException('transportAddress is required');
    }

    if (!dto.eventStart || !dto.eventEnd) {
      throw new BadRequestException('eventStart and eventEnd are required');
    }

    const eventStart = new Date(dto.eventStart);
    const eventEnd = new Date(dto.eventEnd);

    if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) {
      throw new BadRequestException('eventStart or eventEnd is invalid');
    }

    if (eventEnd <= eventStart) {
      throw new BadRequestException('eventEnd must be after eventStart');
    }

    if (!Array.isArray(dto.lineItems) || dto.lineItems.length === 0) {
      throw new BadRequestException('lineItems must contain at least one item');
    }

    for (const item of dto.lineItems) {
      if (!item.decorationId?.trim()) {
        throw new BadRequestException('lineItems[].decorationId is required');
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestException('lineItems[].quantity must be >= 1');
      }
    }
  }
}
