import { getEmailConfig } from './email.config';

describe('getEmailConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.EMAIL_MODE;
    delete process.env.SES_FROM_EMAIL;
    delete process.env.ADMIN_NOTIFY_EMAIL;
    delete process.env.AWS_REGION;
    delete process.env.SES_REGION;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('defaults to stub mode on local', () => {
    process.env.APP_ENV = 'local';

    expect(getEmailConfig().mode).toBe('stub');
  });

  it('uses ses mode when EMAIL_MODE=ses', () => {
    process.env.EMAIL_MODE = 'ses';
    process.env.SES_FROM_EMAIL = 'noreply@example.com';

    const config = getEmailConfig();

    expect(config.mode).toBe('ses');
    expect(config.fromEmail).toBe('noreply@example.com');
  });

  it('auto-selects ses on staging when SES_FROM_EMAIL is set', () => {
    process.env.APP_ENV = 'staging';
    process.env.SES_FROM_EMAIL = 'noreply@example.com';
    process.env.ADMIN_NOTIFY_EMAIL = 'owner@example.com';

    const config = getEmailConfig();

    expect(config.mode).toBe('ses');
    expect(config.adminNotifyEmail).toBe('owner@example.com');
    expect(config.region).toBe('eu-central-1');
  });
});
