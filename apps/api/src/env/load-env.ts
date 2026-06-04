import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { envFileCandidates, getAppEnv } from './app-env';

/**
 * Loads dotenv files from the Nx workspace root (`wzrusz/` when using `nx serve api`).
 * On EB/CI, env vars come from the platform — no dotenv files.
 */
export function loadEnvFiles(): string | undefined {
  const appEnv = getAppEnv();
  const root = process.cwd();

  for (const name of envFileCandidates(appEnv)) {
    const path = resolve(root, name);
    if (existsSync(path)) {
      config({ path });
      return path;
    }
  }

  return undefined;
}
