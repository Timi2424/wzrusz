import { getAppEnv } from '../env/app-env';

export type MediaMode = 'stub' | 's3';

export interface MediaConfig {
  mode: MediaMode;
  region: string;
  bucket: string;
  prefix: string;
}

export function getMediaConfig(): MediaConfig {
  const explicitMode = process.env.MEDIA_MODE?.trim().toLowerCase();
  const bucket = process.env.S3_MEDIA_BUCKET?.trim() || '';
  const prefix =
    process.env.S3_MEDIA_PREFIX?.trim().replace(/^\/+|\/+$/g, '') ||
    'decorations';

  let mode: MediaMode = 'stub';
  if (explicitMode === 's3') {
    mode = 's3';
  } else if (explicitMode !== 'stub' && getAppEnv() !== 'local') {
    mode = bucket ? 's3' : 'stub';
  }

  return {
    mode,
    region:
      process.env.AWS_REGION?.trim() ||
      process.env.S3_REGION?.trim() ||
      'eu-central-1',
    bucket,
    prefix,
  };
}
