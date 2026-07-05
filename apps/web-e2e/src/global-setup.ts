import { execSync } from 'node:child_process';
import { workspaceRoot } from '@nx/devkit';

export default async function globalSetup(): Promise<void> {
  execSync('npm run db:reset', {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: { ...process.env, APP_ENV: 'local' },
  });

  // Warm API after reset when dev server is already running on :3000.
  try {
    await fetch('http://localhost:3000/api/health');
  } catch {
    // Playwright webServer will start api when nothing is listening yet.
  }
}
