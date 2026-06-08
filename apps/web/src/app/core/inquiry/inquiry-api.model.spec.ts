import { buildCreateInquiryPayload } from './inquiry-api.model';

describe('buildCreateInquiryPayload', () => {
  it('maps form and dekolista items for API', () => {
    const payload = buildCreateInquiryPayload(
      {
        fullName: ' Anna ',
        email: 'anna@example.com',
        phone: '',
        eventStart: '2026-08-01T10:00',
        eventEnd: '2026-08-02T18:00',
        transportAddress: ' Poznań ',
        needsInvoice: false,
        invoiceNotes: '',
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

    expect(payload.fullName).toBe('Anna');
    expect(payload.transportAddress).toBe('Poznań');
    expect(payload.phone).toBeNull();
    expect(payload.lineItems).toEqual([{ decorationId: 'dec-1', quantity: 2 }]);
    expect(payload.eventStart).toContain('2026');
  });
});
