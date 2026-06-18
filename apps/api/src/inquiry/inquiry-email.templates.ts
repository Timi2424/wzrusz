import { Inquiry } from '../database/entities/inquiry.entity';
import { CreateInquiryDto } from './inquiry.dto';

function formatPlDate(value: Date | string): string {
  return new Date(value).toLocaleString('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function buildAdminNewInquiryEmail(
  inquiryId: string,
  payload: CreateInquiryDto,
) {
  const subject = `Wzrusz — nowe zapytanie od ${payload.fullName.trim()}`;
  const text = [
    'Nowe zapytanie w panelu Wzrusz.',
    '',
    `ID: ${inquiryId}`,
    `Klient: ${payload.fullName.trim()}`,
    `E-mail: ${payload.email.trim()}`,
    `Telefon: ${payload.phone?.trim() || '—'}`,
    `Termin: ${formatPlDate(payload.eventStart)} — ${formatPlDate(payload.eventEnd)}`,
    `Transport: ${payload.transportAddress.trim()}`,
    `Pozycji w dekoliscie: ${payload.lineItems.length}`,
    '',
    'Zaloguj się do panelu admina, aby sprawdzić szczegóły.',
  ].join('\n');

  return { subject, text };
}

export function buildClientSuccessEmail(inquiry: Inquiry) {
  const decorations = [...(inquiry.lineItems ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(
      (line) =>
        `• ${line.decoration?.name ?? 'Dekoracja'} × ${line.quantity}`,
    )
    .join('\n');

  const subject = 'Wzrusz — potwierdzenie rezerwacji dekoracji';
  const text = [
    `Cześć ${inquiry.fullName},`,
    '',
    'Potwierdzamy przyjęcie Twojej rezerwacji dekoracji Wzrusz.',
    '',
    `Termin: ${formatPlDate(inquiry.eventStart)} — ${formatPlDate(inquiry.eventEnd)}`,
    `Adres transportu: ${inquiry.transportAddress}`,
    '',
    'Zarezerwowane dekoracje:',
    decorations || '—',
    '',
    'W razie pytań odpowiemy na tę wiadomość lub skontaktujemy się telefonicznie.',
    '',
    'Pozdrawiamy,',
    'Zespół Wzrusz',
  ].join('\n');

  const html = text
    .split('\n')
    .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : '<br />'))
    .join('');

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
