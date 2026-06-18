import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { ScheduleEvent } from '../database/entities/schedule-event.entity';
import { ScheduleEventLineItem } from '../database/entities/schedule-event-line-item.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryApprovalService } from './inquiry-approval.service';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquirySuccessEmailService } from './inquiry-success-email.service';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    TypeOrmModule.forFeature([
      Inquiry,
      InquiryLineItem,
      Decoration,
      ScheduleEvent,
      ScheduleEventLineItem,
    ]),
  ],
  controllers: [InquiryController],
  providers: [
    InquiryService,
    InquiryApprovalService,
    InquiryNotificationService,
    InquirySuccessEmailService,
  ],
})
export class InquiryModule {}
