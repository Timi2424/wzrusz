import { InquiryFormValue } from './inquiry-form.model';
import { DekolistaItem } from '../dekolista/dekolista.model';

export interface CreateInquiryLineItemPayload {
  decorationId: string;
  quantity: number;
}

export interface CreateInquiryPayload {
  fullName: string;
  email: string;
  phone: string | null;
  eventStart: string;
  eventEnd: string;
  transportAddress: string;
  needsInvoice: boolean;
  invoiceNotes: string | null;
  lineItems: CreateInquiryLineItemPayload[];
}

export interface CreateInquiryResponse {
  id: string;
  status: 'submitted';
  createdAt: string;
}

export function buildCreateInquiryPayload(
  form: InquiryFormValue,
  items: readonly DekolistaItem[],
): CreateInquiryPayload {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    eventStart: toIsoDateTime(form.eventStart),
    eventEnd: toIsoDateTime(form.eventEnd),
    transportAddress: form.transportAddress.trim(),
    needsInvoice: form.needsInvoice,
    invoiceNotes: form.needsInvoice ? form.invoiceNotes.trim() || null : null,
    lineItems: items.map((item) => ({
      decorationId: item.decorationId,
      quantity: item.quantity,
    })),
  };
}

function toIsoDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString();
}
