import { getMediaConfig } from './media.config';

describe('getMediaConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.MEDIA_MODE;
    delete process.env.S3_MEDIA_BUCKET;
    delete process.env.S3_MEDIA_PREFIX;
    delete process.env.AWS_REGION;
    delete process.env.S3_REGION;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('defaults to stub mode on local', () => {
    process.env.APP_ENV = 'local';

    expect(getMediaConfig().mode).toBe('stub');
  });

  it('uses s3 mode when MEDIA_MODE=s3', () => {
    process.env.MEDIA_MODE = 's3';
    process.env.S3_MEDIA_BUCKET = 'wzrusz-media-staging';

    const config = getMediaConfig();

    expect(config.mode).toBe('s3');
    expect(config.bucket).toBe('wzrusz-media-staging');
    expect(config.prefix).toBe('decorations');
  });

  it('auto-selects s3 on staging when bucket is set', () => {
    process.env.APP_ENV = 'staging';
    process.env.S3_MEDIA_BUCKET = 'wzrusz-media-staging';
    process.env.S3_MEDIA_PREFIX = 'decorations';

    const config = getMediaConfig();

    expect(config.mode).toBe('s3');
    expect(config.region).toBe('eu-central-1');
  });
});
