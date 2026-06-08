import { Body, Controller, Get, Post } from '@nestjs/common';
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

  /** Interim (staging): public until S-06 AdminAuthGuard on this route. */
  @Get()
  list(): Promise<InquirySummaryDto[]> {
    return this.inquiries.listSummaries();
  }
}
