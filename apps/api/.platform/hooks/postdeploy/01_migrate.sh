#!/bin/bash
set -eo pipefail

cd /var/app/current

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL not set - skipping migrations"
  exit 0
fi

if [ ! -f migrate/database/run-migrations.js ]; then
  echo "Migration bundle missing - skipping"
  exit 0
fi

echo "Running database migrations (APP_ENV=${APP_ENV:-unknown}, node=$(node -v))..."
node migrate/database/run-migrations.js
