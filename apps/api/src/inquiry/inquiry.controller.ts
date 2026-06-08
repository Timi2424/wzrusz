import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import {
  CreateInquiryDto,
  CreateInquiryResponseDto,
  InquirySummaryDto,
} from './inquiry.dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiries: InquiryService) {}

  @Post()
  create(@Body() body: CreateInquiryDto): Promise<CreateInquiryResponseDto> {
    return this.inquiries.create(body);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  list(): Promise<InquirySummaryDto[]> {
    return this.inquiries.listSummaries();
  }
}
