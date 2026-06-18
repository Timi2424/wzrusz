import { Injectable, Logger } from '@nestjs/common';
import { EmailMessage, EmailSender } from './email.types';

@Injectable()
export class StubEmailSender implements EmailSender {
  private readonly logger = new Logger(StubEmailSender.name);

  async send(message: EmailMessage): Promise<void> {
    this.logger.log(
      `[email-stub] To: ${message.to} | Subject: ${message.subject} | ${message.text.replace(/\s+/g, ' ').trim()}`,
    );
  }
}
