import { Injectable, Logger } from '@nestjs/common';
import { Inquiry } from '../database/entities/inquiry.entity';
import { CreateInquiryDto } from './inquiry.dto';

/** Stub until F-04 SES — logs intent; wire SES in F-04 without changing callers. */
@Injectable()
export class InquiryNotificationService {
  private readonly logger = new Logger(InquiryNotificationService.name);

  notifyAdminNewInquiry(inquiryId: string, payload: CreateInquiryDto): void {
    this.logger.log(
      `[email-stub] New inquiry ${inquiryId} from ${payload.email} (${payload.lineItems.length} line items)`,
    );
  }

  sendSuccessConfirmation(inquiry: Inquiry): void {
    const decorations = [...(inquiry.lineItems ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(
        (line) =>
          `${line.decoration?.name ?? 'Dekoracja'} × ${line.quantity}`,
      )
      .join(', ');

    this.logger.log(
      [
        `[email-stub] Success confirmation to ${inquiry.email}`,
        `Subject: Wzrusz — potwierdzenie rezerwacji`,
        `To: ${inquiry.fullName} <${inquiry.email}>`,
        `Event: ${inquiry.eventStart.toISOString()} — ${inquiry.eventEnd.toISOString()}`,
        `Items: ${decorations || '—'}`,
      ].join(' | '),
    );
  }
}
