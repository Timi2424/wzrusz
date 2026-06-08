import { getAppEnv } from './app-env';

const LOCAL_DEV_JWT_SECRET = 'local-dev-jwt-secret-change-me';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) {
    return secret;
  }
  if (getAppEnv() === 'local') {
    return LOCAL_DEV_JWT_SECRET;
  }
  throw new Error('JWT_SECRET is required when APP_ENV is not local');
}

export const JWT_EXPIRES_IN = '8h';
