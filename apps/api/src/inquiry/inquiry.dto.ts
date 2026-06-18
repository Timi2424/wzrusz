export interface CreateInquiryLineItemDto {
  decorationId: string;
  quantity: number;
}

export interface CreateInquiryDto {
  fullName: string;
  email: string;
  phone?: string | null;
  eventStart: string;
  eventEnd: string;
  transportAddress: string;
  needsInvoice: boolean;
  invoiceNotes?: string | null;
  lineItems: CreateInquiryLineItemDto[];
}

export interface CreateInquiryResponseDto {
  id: string;
  status: 'submitted';
  createdAt: string;
}

export interface InquirySummaryDto {
  id: string;
  fullName: string;
  email: string;
  eventStart: string;
  eventEnd: string;
  status: 'submitted' | 'approved';
  createdAt: string;
  lineItemCount: number;
}

export interface InquiryListFiltersDto {
  from?: string;
  to?: string;
}

export interface InquiryDetailLineItemDto {
  id: string;
  decorationId: string;
  decorationName: string;
  quantity: number;
  sortOrder: number;
}

export interface InquiryDetailDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  eventStart: string;
  eventEnd: string;
  transportAddress: string;
  needsInvoice: boolean;
  invoiceNotes: string | null;
  status: 'submitted' | 'approved';
  successEmailSentAt: string | null;
  createdAt: string;
  lineItems: InquiryDetailLineItemDto[];
}

export interface SendSuccessEmailResponseDto {
  inquiryId: string;
  successEmailSentAt: string;
}
