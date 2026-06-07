export interface InquiryFormValue {
  fullName: string;
  email: string;
  phone: string;
  eventStart: string;
  eventEnd: string;
  transportAddress: string;
  needsInvoice: boolean;
  invoiceNotes: string;
}

export const EMPTY_INQUIRY_FORM: InquiryFormValue = {
  fullName: '',
  email: '',
  phone: '',
  eventStart: '',
  eventEnd: '',
  transportAddress: '',
  needsInvoice: false,
  invoiceNotes: '',
};
