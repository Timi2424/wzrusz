import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';
import { SendSuccessEmailResponseDto } from './inquiry.dto';
import { InquiryNotificationService } from './inquiry-notification.service';

@Injectable()
export class InquirySuccessEmailService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiries: Repository<Inquiry>,
    private readonly notifications: InquiryNotificationService,
  ) {}

  async send(id: string): Promise<SendSuccessEmailResponseDto> {
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

    if (inquiry.status !== InquiryStatus.Approved) {
      throw new ConflictException(
        'Success email can only be sent for approved inquiries',
      );
    }

    await this.notifications.sendSuccessConfirmation(inquiry);

    inquiry.successEmailSentAt = new Date();
    await this.inquiries.save(inquiry);

    return {
      inquiryId: inquiry.id,
      successEmailSentAt: inquiry.successEmailSentAt.toISOString(),
    };
  }
}
