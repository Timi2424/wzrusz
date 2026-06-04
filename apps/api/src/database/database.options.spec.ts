import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { buildTypeOrmOptions } from './database.options';

describe('buildTypeOrmOptions', () => {
  const originalUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalUrl;
    }
  });

  it('throws when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    expect(() => buildTypeOrmOptions()).toThrow(/DATABASE_URL is required/);
  });

  it('enables verified ssl for RDS-style URLs', () => {
    process.env.DATABASE_URL =
      'postgresql://u:p@host:5432/db?sslmode=require';
    const options = buildTypeOrmOptions() as TypeOrmModuleOptions & {
      url?: string;
      ssl?: { ca: string; rejectUnauthorized: boolean };
    };
    expect(options.url).toBe('postgresql://u:p@host:5432/db');
    expect(options.ssl?.rejectUnauthorized).toBe(true);
    expect(options.ssl?.ca).toContain('BEGIN CERTIFICATE');
    expect(options.synchronize).toBe(false);
  });

  it('omits ssl for local URLs', () => {
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/wzrusz_dev';
    const options = buildTypeOrmOptions() as TypeOrmModuleOptions & {
      ssl?: { ca: string; rejectUnauthorized: boolean };
    };
    expect(options.ssl).toBeUndefined();
  });
});
