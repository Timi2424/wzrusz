import {
  loadRdsCaBundle,
  stripSslModeFromDatabaseUrl,
  urlRequiresSsl,
} from './database.connection';

describe('urlRequiresSsl', () => {
  it('detects sslmode=require', () => {
    expect(urlRequiresSsl('postgresql://h/db?sslmode=require')).toBe(true);
  });

  it('is false for local docker url', () => {
    expect(urlRequiresSsl('postgresql://localhost:5433/wzrusz_dev')).toBe(false);
  });
});

describe('stripSslModeFromDatabaseUrl', () => {
  it('removes sslmode query param', () => {
    expect(
      stripSslModeFromDatabaseUrl(
        'postgresql://u:p@host:5432/db?sslmode=require',
      ),
    ).toBe('postgresql://u:p@host:5432/db');
  });
});

describe('loadRdsCaBundle', () => {
  it('loads AWS RDS CA from apps/api/certs', () => {
    const pem = loadRdsCaBundle();
    expect(pem).toContain('BEGIN CERTIFICATE');
  });
});
