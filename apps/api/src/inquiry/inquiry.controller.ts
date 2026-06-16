import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import {
  ApproveInquiryDto,
  ApproveInquiryResponseDto,
  InquiryAvailabilityDto,
} from './inquiry-approval.dto';
import { InquiryApprovalService } from './inquiry-approval.service';
import {
  CreateInquiryDto,
  InquiryDetailDto,
  InquiryListFiltersDto,
  CreateInquiryResponseDto,
  InquirySummaryDto,
} from './inquiry.dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiries')
export class InquiryController {
  constructor(
    private readonly inquiries: InquiryService,
    private readonly approval: InquiryApprovalService,
  ) {}

  @Post()
  create(@Body() body: CreateInquiryDto): Promise<CreateInquiryResponseDto> {
    return this.inquiries.create(body);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  list(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<InquirySummaryDto[]> {
    const filters: InquiryListFiltersDto = {
      from: this.validateOptionalDate(from, 'from'),
      to: this.validateOptionalDate(to, 'to'),
    };
    return this.inquiries.listSummaries(filters);
  }

  @Get(':id/availability')
  @UseGuards(AdminAuthGuard)
  availability(@Param('id') id: string): Promise<InquiryAvailabilityDto> {
    return this.approval.getAvailability(id);
  }

  @Post(':id/approve')
  @UseGuards(AdminAuthGuard)
  approve(
    @Param('id') id: string,
    @Body() body: ApproveInquiryDto,
  ): Promise<ApproveInquiryResponseDto> {
    return this.approval.approve(id, body);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  detail(@Param('id') id: string): Promise<InquiryDetailDto> {
    return this.inquiries.getDetail(id);
  }

  private validateOptionalDate(
    value: string | undefined,
    field: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }
    if (Number.isNaN(new Date(value).getTime())) {
      throw new BadRequestException(`${field} must be a valid date`);
    }
    return value;
  }
}
