import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { EmailConfig } from './email.config';
import { EmailMessage, EmailSender } from './email.types';

@Injectable()
export class SesEmailSender implements EmailSender {
  private readonly logger = new Logger(SesEmailSender.name);
  private readonly client: SESClient;

  constructor(private readonly config: EmailConfig) {
    this.client = new SESClient({ region: config.region });
  }

  async send(message: EmailMessage): Promise<void> {
    try {
      await this.client.send(
        new SendEmailCommand({
          Source: this.config.fromEmail,
          Destination: {
            ToAddresses: [message.to],
          },
          Message: {
            Subject: { Data: message.subject, Charset: 'UTF-8' },
            Body: {
              Text: { Data: message.text, Charset: 'UTF-8' },
              ...(message.html
                ? { Html: { Data: message.html, Charset: 'UTF-8' } }
                : {}),
            },
          },
        }),
      );
    } catch (error) {
      this.logger.error(
        `SES send failed for ${message.to}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
