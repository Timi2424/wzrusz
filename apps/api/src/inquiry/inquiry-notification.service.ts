import { Injectable, Logger } from '@nestjs/common';
import { CreateInquiryDto } from './inquiry.dto';

/** Stub until F-04 SES — logs intent; no outbound mail in S-05. */
@Injectable()
export class InquiryNotificationService {
  private readonly logger = new Logger(InquiryNotificationService.name);

  notifyAdminNewInquiry(inquiryId: string, payload: CreateInquiryDto): void {
    this.logger.log(
      `[email-stub] New inquiry ${inquiryId} from ${payload.email} (${payload.lineItems.length} line items)`,
    );
  }
}
