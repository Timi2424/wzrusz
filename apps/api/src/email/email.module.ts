import { Module } from '@nestjs/common';
import { getEmailConfig } from './email.config';
import { EMAIL_SENDER } from './email.types';
import { SesEmailSender } from './ses-email.sender';
import { StubEmailSender } from './stub-email.sender';

@Module({
  providers: [
    {
      provide: EMAIL_SENDER,
      useFactory: () => {
        const config = getEmailConfig();
        return config.mode === 'ses'
          ? new SesEmailSender(config)
          : new StubEmailSender();
      },
    },
  ],
  exports: [EMAIL_SENDER],
})
export class EmailModule {}
