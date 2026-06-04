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

  it('enables ssl for RDS-style URLs', () => {
    process.env.DATABASE_URL =
      'postgresql://u:p@host:5432/db?sslmode=require';
    const options = buildTypeOrmOptions() as TypeOrmModuleOptions & {
      ssl?: { rejectUnauthorized: boolean };
    };
    expect(options.ssl).toEqual({ rejectUnauthorized: false });
    expect(options.synchronize).toBe(false);
  });

  it('omits ssl for local URLs', () => {
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/wzrusz_dev';
    const options = buildTypeOrmOptions() as TypeOrmModuleOptions & {
      ssl?: { rejectUnauthorized: boolean };
    };
    expect(options.ssl).toBeUndefined();
  });
});
