import { Inject, Injectable, Logger } from '@nestjs/common';
import { Inquiry } from '../database/entities/inquiry.entity';
import { EMAIL_SENDER, EmailSender } from '../email/email.types';
import { getEmailConfig } from '../email/email.config';
import { CreateInquiryDto } from './inquiry.dto';
import {
  buildAdminNewInquiryEmail,
  buildClientSuccessEmail,
} from './inquiry-email.templates';

@Injectable()
export class InquiryNotificationService {
  private readonly logger = new Logger(InquiryNotificationService.name);
  private readonly config = getEmailConfig();

  constructor(@Inject(EMAIL_SENDER) private readonly mailer: EmailSender) {}

  async notifyAdminNewInquiry(
    inquiryId: string,
    payload: CreateInquiryDto,
  ): Promise<void> {
    const { subject, text } = buildAdminNewInquiryEmail(inquiryId, payload);

    await this.mailer.send({
      to: this.config.adminNotifyEmail,
      subject,
      text,
    });

    this.logger.log(`Admin notified about inquiry ${inquiryId}`);
  }

  async sendSuccessConfirmation(inquiry: Inquiry): Promise<void> {
    const { subject, text, html } = buildClientSuccessEmail(inquiry);

    await this.mailer.send({
      to: inquiry.email,
      subject,
      text,
      html,
    });

    this.logger.log(`Success confirmation sent to ${inquiry.email}`);
  }
}
