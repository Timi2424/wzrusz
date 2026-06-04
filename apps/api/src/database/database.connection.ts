import { getAppEnv } from '../env/app-env';

export type PostgresConnectionConfig = {
  type: 'postgres';
  url: string;
  ssl?: { rejectUnauthorized: boolean };
};

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

export function resolvePostgresConnection(): PostgresConnectionConfig {
  const url = resolveDatabaseUrl();
  const needsSsl =
    url.includes('sslmode=require') || url.includes('sslmode=verify-full');

  return {
    type: 'postgres',
    url,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}
