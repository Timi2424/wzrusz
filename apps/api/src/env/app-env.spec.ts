import { envFileCandidates, getAppEnv } from './app-env';

describe('getAppEnv', () => {
  const original = process.env.APP_ENV;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.APP_ENV;
    } else {
      process.env.APP_ENV = original;
    }
  });

  it('defaults to local', () => {
    delete process.env.APP_ENV;
    expect(getAppEnv()).toBe('local');
  });

  it('accepts staging and production', () => {
    process.env.APP_ENV = 'staging';
    expect(getAppEnv()).toBe('staging');
    process.env.APP_ENV = 'production';
    expect(getAppEnv()).toBe('production');
  });
});

describe('envFileCandidates', () => {
  it('loads dotenv files only for local', () => {
    expect(envFileCandidates('local')).toEqual(['.env']);
    expect(envFileCandidates('staging')).toEqual([]);
    expect(envFileCandidates('production')).toEqual([]);
  });
});
