import * as path from 'node:path';

export const LOCAL_MEDIA_ROOT = path.join(process.cwd(), '.local-media');

export function localMediaFilePath(key: string): string {
  const normalized = key.replace(/^\/+/, '');
  if (normalized.includes('..') || !normalized.startsWith('decorations/')) {
    throw new Error('Invalid media key');
  }
  return path.join(LOCAL_MEDIA_ROOT, normalized);
}

export function localMediaPublicUrl(key: string): string {
  const normalized = key.replace(/^\/+/, '');
  return `/api/media/${normalized}`;
}
