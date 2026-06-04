export type AppEnv = 'local' | 'staging' | 'production';

const APP_ENVS: readonly AppEnv[] = ['local', 'staging', 'production'];

export function getAppEnv(): AppEnv {
  const value = process.env.APP_ENV?.trim().toLowerCase();
  if (APP_ENVS.includes(value as AppEnv)) {
    return value as AppEnv;
  }
  return 'local';
}

/** Dotenv files are loaded only for local dev. EB/CI set env vars in the platform. */
export function envFileCandidates(appEnv: AppEnv): string[] {
  return appEnv === 'local' ? ['.env'] : [];
}
