#!/usr/bin/env bash
set -euo pipefail

API="http://Wzrusz-api-staging-env.eba-umryzx3z.eu-central-1.elasticbeanstalk.com"
WEB="http://wzrusz-web-staging.eba-mzegvtma.eu-central-1.elasticbeanstalk.com"

echo "1. API /api"
test "$(curl -fsS --max-time 15 "$API/api")" = '{"message":"Hello API"}' && echo "   OK"

echo "2. API /api/health"
health=$(curl -fsS --max-time 15 "$API/api/health")
echo "$health" | grep -q '"status":"ok"' && echo "   status OK"
if echo "$health" | grep -q '"database":"up"'; then
  echo "   database OK"
else
  echo "   WARN: database not up — $health"
fi

echo "3. Web status"
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$WEB/")
test "$code" = "200" && echo "   OK ($code)"

echo "4. Web title"
curl -fsS --max-time 15 "$WEB/" | grep -q '<title>Wzrusz</title>' && echo "   OK"

echo "5. Web SSR body (app-root ma treść?)"
if curl -fsS --max-time 15 "$WEB/" | grep -q '<app-root></app-root>'; then
  echo "   WARN: app-root pusty — sprawdź View Source / SSR w przeglądarce"
else
  echo "   OK: app-root ma content"
fi

echo "6. AWS EB health"
aws elasticbeanstalk describe-environments --profile wzrusz --region eu-central-1 \
  --query 'Environments[*].{Name:EnvironmentName,Health:Health,Status:Status}' --output table

echo "Done."