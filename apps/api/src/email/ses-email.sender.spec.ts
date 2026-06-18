import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { SesEmailSender } from './ses-email.sender';

jest.mock('@aws-sdk/client-ses', () => {
  const send = jest.fn();
  return {
    SESClient: jest.fn(() => ({ send })),
    SendEmailCommand: jest.fn((input) => input),
    __mockSend: send,
  };
});

const mockSend = (
  jest.requireMock('@aws-sdk/client-ses') as { __mockSend: jest.Mock }
).__mockSend;

describe('SesEmailSender', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({});
  });

  it('sends email through SES', async () => {
    const sender = new SesEmailSender({
      mode: 'ses',
      region: 'eu-central-1',
      fromEmail: 'noreply@example.com',
      adminNotifyEmail: 'admin@example.com',
    });

    await sender.send({
      to: 'client@example.com',
      subject: 'Test',
      text: 'Hello',
      html: '<p>Hello</p>',
    });

    expect(SESClient).toHaveBeenCalledWith({ region: 'eu-central-1' });
    expect(SendEmailCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Source: 'noreply@example.com',
        Destination: { ToAddresses: ['client@example.com'] },
      }),
    );
    expect(mockSend).toHaveBeenCalled();
  });
});
