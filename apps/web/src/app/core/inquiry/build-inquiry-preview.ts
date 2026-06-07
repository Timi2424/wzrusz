import { DekolistaItem } from '../dekolista/dekolista.model';
import { InquiryFormValue } from './inquiry-form.model';

export function formatDateTimeLocal(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function buildInquiryPreview(
  form: InquiryFormValue,
  items: readonly DekolistaItem[],
): string {
  const hasAnyField =
    form.fullName.trim() ||
    form.email.trim() ||
    form.transportAddress.trim() ||
    form.eventStart ||
    form.eventEnd;

  if (!hasAnyField && items.length === 0) {
    return 'Wypełnij formularz, aby zobaczyć podgląd wiadomości.';
  }

  const lines: string[] = ['Dzień dobry,', '', 'Chciałbym/Chciałabym zapytać o wypożyczenie dekoracji:'];

  if (items.length > 0) {
    lines.push('');
    for (const item of items) {
      lines.push(`• ${item.name} (${item.categoryName}) — ${item.quantity} szt.`);
    }
  } else {
    lines.push('', '• (brak pozycji na Dekoliście)');
  }

  lines.push(
    '',
    `Termin: od ${formatDateTimeLocal(form.eventStart)} do ${formatDateTimeLocal(form.eventEnd)}`,
    `Adres transportu / montażu: ${form.transportAddress.trim() || '—'}`,
  );

  if (form.needsInvoice) {
    lines.push(
      'Faktura: tak',
      form.invoiceNotes.trim()
        ? `Uwagi do faktury: ${form.invoiceNotes.trim()}`
        : 'Uwagi do faktury: —',
    );
  } else {
    lines.push('Faktura: nie');
  }

  lines.push(
    '',
    'Dane kontaktowe:',
    `Imię i nazwisko: ${form.fullName.trim() || '—'}`,
    `E-mail: ${form.email.trim() || '—'}`,
    `Telefon: ${form.phone.trim() || '—'}`,
    '',
    'Pozdrawiam,',
    form.fullName.trim() || '—',
  );

  return lines.join('\n');
}
