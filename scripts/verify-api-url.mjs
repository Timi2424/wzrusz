#!/usr/bin/env node
/**
 * Fail CI when NX_API_URL hostname does not resolve (avoids baking a dead URL into the browser bundle).
 * Usage: NX_API_URL=http://... node scripts/verify-api-url.mjs
 */
import dns from 'node:dns/promises';

const raw = process.env.NX_API_URL?.trim() ?? '';

if (!raw) {
  console.error('NX_API_URL is empty — set GitHub variable in environment "wzrusz".');
  process.exit(1);
}

let hostname;
try {
  hostname = new URL(raw).hostname;
} catch {
  console.error(`NX_API_URL is not a valid URL: ${raw}`);
  process.exit(1);
}

try {
  await dns.lookup(hostname);
  console.log(`NX_API_URL hostname resolves: ${hostname}`);
} catch (error) {
  console.error(`NX_API_URL hostname does NOT resolve: ${hostname}`);
  console.error(
    'Use the Elastic Beanstalk CNAME from AWS Console (format: *.eba-XXXX.eu-central-1.elasticbeanstalk.com).',
  );
  console.error(String(error));
  process.exit(1);
}
