import { buildClientSuccessEmail } from './inquiry-email.templates';
import { Inquiry } from '../database/entities/inquiry.entity';
import { InquiryStatus } from '../database/entities/inquiry-status.enum';

describe('inquiry email templates', () => {
  it('builds a Polish success email for the client', () => {
    const inquiry = {
      fullName: 'Anna Kowalska',
      email: 'anna@example.com',
      eventStart: new Date('2026-07-01T08:00:00.000Z'),
      eventEnd: new Date('2026-07-02T18:00:00.000Z'),
      transportAddress: 'Kraków, ul. Testowa 1',
      lineItems: [
        {
          sortOrder: 0,
          quantity: 2,
          decoration: { name: 'Girlanda' },
        },
      ],
    } as Inquiry;

    const message = buildClientSuccessEmail(inquiry);

    expect(message.subject).toContain('potwierdzenie');
    expect(message.text).toContain('Anna Kowalska');
    expect(message.text).toContain('Girlanda × 2');
    expect(message.html).toContain('Girlanda');
  });
});
