import { WZ_API_BASE_URL } from './api-base-url.generated';

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

/** Base URL for Nest API (no trailing slash). Empty in browser dev → use relative `/api` via proxy. */
export function getApiBaseUrl(): string {
  if (WZ_API_BASE_URL) {
    return trimTrailingSlash(WZ_API_BASE_URL);
  }

  if (typeof process !== 'undefined' && process.env['NX_API_URL']) {
    return trimTrailingSlash(process.env['NX_API_URL']);
  }

  if (typeof window !== 'undefined') {
    return '';
  }

  return 'http://localhost:3000';
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalized}` : normalized;
}
