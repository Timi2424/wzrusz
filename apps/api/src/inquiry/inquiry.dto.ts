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
  status: 'submitted';
  createdAt: string;
  lineItemCount: number;
}
