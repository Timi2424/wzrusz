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
  status: 'submitted';
  createdAt: string;
  lineItemCount: number;
}

export interface InquiryListFilters {
  from?: string;
  to?: string;
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
  status: 'submitted';
  createdAt: string;
  lineItems: InquiryDetailLineItem[];
}
