import { buildInquiryPreview } from './build-inquiry-preview';
import { EMPTY_INQUIRY_FORM } from './inquiry-form.model';

describe('buildInquiryPreview', () => {
  it('returns placeholder when form is empty', () => {
    expect(buildInquiryPreview(EMPTY_INQUIRY_FORM, [])).toContain('Wypełnij formularz');
  });

  it('includes dekolista items and contact fields', () => {
    const preview = buildInquiryPreview(
      {
        ...EMPTY_INQUIRY_FORM,
        fullName: 'Anna Kowalska',
        email: 'anna@example.com',
        phone: '+48 600 000 000',
        eventStart: '2026-07-01T10:00',
        eventEnd: '2026-07-02T18:00',
        transportAddress: 'Poznań, ul. Testowa 1',
        needsInvoice: true,
        invoiceNotes: 'NIP 123',
      },
      [
        {
          decorationId: 'dec-1',
          name: 'Girlanda',
          slug: 'girlanda',
          categoryName: 'Balony',
          quantity: 2,
        },
      ],
    );

    expect(preview).toContain('Girlanda');
    expect(preview).toContain('2 szt.');
    expect(preview).toContain('Anna Kowalska');
    expect(preview).toContain('anna@example.com');
    expect(preview).toContain('Poznań, ul. Testowa 1');
    expect(preview).toContain('Faktura: tak');
    expect(preview).toContain('NIP 123');
  });
});
