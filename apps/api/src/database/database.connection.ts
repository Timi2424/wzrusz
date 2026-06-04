import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { getAppEnv } from '../env/app-env';

export type PostgresConnectionConfig = {
  type: 'postgres';
  url: string;
  ssl?: { ca: string; rejectUnauthorized: true };
};

const RDS_CA_FILE = 'rds-ca-bundle.pem';

export function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    const env = getAppEnv();
    throw new Error(
      `DATABASE_URL is required (APP_ENV=${env}). ` +
        `Local: copy .env.example → .env and run npm run db:up.`,
    );
  }
  return url;
}

export function urlRequiresSsl(url: string): boolean {
  return (
    url.includes('sslmode=require') ||
    url.includes('sslmode=verify-full') ||
    url.includes('sslmode=verify-ca')
  );
}

/** pg v8+ treats sslmode in the URL as verify-full; use explicit ssl.ca instead. */
export function stripSslModeFromDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('sslmode')) {
      return url;
    }
    parsed.searchParams.delete('sslmode');
    const query = parsed.searchParams.toString();
    parsed.search = query ? `?${query}` : '';
    return parsed.toString();
  } catch {
    return url
      .replace(/([?&])sslmode=[^&]*/g, (match, sep) => (sep === '?' ? '?' : ''))
      .replace(/\?&/, '?')
      .replace(/\?$/, '');
  }
}

export function loadRdsCaBundle(): string {
  const candidates = [
    join(process.cwd(), 'certs', RDS_CA_FILE),
    join(__dirname, '..', '..', 'certs', RDS_CA_FILE),
    join(__dirname, '..', '..', '..', 'certs', RDS_CA_FILE),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      return readFileSync(path, 'utf8');
    }
  }

  throw new Error(
    `RDS CA bundle not found (${RDS_CA_FILE}). Expected under ./certs/ (EB deploy or apps/api/certs/).`,
  );
}

export function resolvePostgresConnection(): PostgresConnectionConfig {
  const rawUrl = resolveDatabaseUrl();

  if (!urlRequiresSsl(rawUrl)) {
    return { type: 'postgres', url: rawUrl };
  }

  return {
    type: 'postgres',
    url: stripSslModeFromDatabaseUrl(rawUrl),
    ssl: { ca: loadRdsCaBundle(), rejectUnauthorized: true },
  };
}
