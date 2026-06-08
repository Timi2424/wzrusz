import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Decoration } from '../database/entities/decoration.entity';
import { InquiryLineItem } from '../database/entities/inquiry-line-item.entity';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryNotificationService } from './inquiry-notification.service';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Inquiry, InquiryLineItem, Decoration]),
  ],
  controllers: [InquiryController],
  providers: [InquiryService, InquiryNotificationService],
})
export class InquiryModule {}
