import { getAppEnv } from '../env/app-env';

export type EmailMode = 'stub' | 'ses';

export interface EmailConfig {
  mode: EmailMode;
  region: string;
  fromEmail: string;
  adminNotifyEmail: string;
}

export function getEmailConfig(): EmailConfig {
  const explicitMode = process.env.EMAIL_MODE?.trim().toLowerCase();
  const fromEmail =
    process.env.SES_FROM_EMAIL?.trim() || 'noreply@wzrusz.local';
  const adminNotifyEmail =
    process.env.ADMIN_NOTIFY_EMAIL?.trim() || 'admin@wzrusz.local';

  let mode: EmailMode = 'stub';
  if (explicitMode === 'ses') {
    mode = 'ses';
  } else if (explicitMode !== 'stub' && getAppEnv() !== 'local') {
    mode = process.env.SES_FROM_EMAIL ? 'ses' : 'stub';
  }

  return {
    mode,
    region:
      process.env.AWS_REGION?.trim() ||
      process.env.SES_REGION?.trim() ||
      'eu-central-1',
    fromEmail,
    adminNotifyEmail,
  };
}
