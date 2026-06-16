export type InquiryStatusDto = 'submitted' | 'approved';

export interface InquiryAvailabilityItemDto {
  lineItemId: string;
  decorationId: string;
  decorationName: string;
  requestedQuantity: number;
  availableQuantity: number;
  status: 'ok' | 'shortage';
}

export interface InquiryAvailabilityDto {
  inquiryId: string;
  canApprove: boolean;
  items: InquiryAvailabilityItemDto[];
}

export interface ApproveInquiryLineItemDto {
  lineItemId: string;
  quantity: number;
}

export interface ApproveInquiryDto {
  lineItems: ApproveInquiryLineItemDto[];
}

export interface ApproveInquiryResponseDto {
  inquiryId: string;
  status: 'approved';
  scheduleEventId: string;
}
