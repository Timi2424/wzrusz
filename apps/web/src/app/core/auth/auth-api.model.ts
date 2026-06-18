export type UserRole = 'admin' | 'user';

export interface AuthUser {
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface InquirySummary {
  id: string;
  fullName: string;
  email: string;
  eventStart: string;
  eventEnd: string;
  status: 'submitted' | 'approved';
  createdAt: string;
  lineItemCount: number;
}

export interface InquiryListFilters {
  from?: string;
  to?: string;
}

export interface InquiryAvailabilityItem {
  lineItemId: string;
  decorationId: string;
  decorationName: string;
  requestedQuantity: number;
  availableQuantity: number;
  status: 'ok' | 'shortage';
}

export interface InquiryAvailability {
  inquiryId: string;
  canApprove: boolean;
  items: InquiryAvailabilityItem[];
}

export interface ApproveInquiryLineItem {
  lineItemId: string;
  quantity: number;
}

export interface ApproveInquiryPayload {
  lineItems: ApproveInquiryLineItem[];
}

export interface ApproveInquiryResponse {
  inquiryId: string;
  status: 'approved';
  scheduleEventId: string;
}

export interface SendSuccessEmailResponse {
  inquiryId: string;
  successEmailSentAt: string;
}

export interface InquiryDetailLineItem {
  id: string;
  decorationId: string;
  decorationName: string;
  quantity: number;
  sortOrder: number;
}

export interface InquiryDetail {
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
  lineItems: InquiryDetailLineItem[];
}
