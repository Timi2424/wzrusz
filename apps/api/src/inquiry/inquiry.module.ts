import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry, InquiryLineItem, Decoration])],
  controllers: [InquiryController],
  providers: [InquiryService, InquiryNotificationService],
})
export class InquiryModule {}
