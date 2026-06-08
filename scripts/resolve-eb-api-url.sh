#!/usr/bin/env bash
# Resolve Nest API base URL from Elastic Beanstalk environment CNAME.
# Usage: EB_API_ENVIRONMENT_NAME=Wzrusz-api-staging-env AWS_REGION=eu-central-1 ./scripts/resolve-eb-api-url.sh
set -euo pipefail

ENV_NAME="${EB_API_ENVIRONMENT_NAME:-Wzrusz-api-staging-env}"
REGION="${AWS_REGION:-eu-central-1}"

CNAME="$(aws elasticbeanstalk describe-environments \
  --environment-names "$ENV_NAME" \
  --region "$REGION" \
  --query 'Environments[0].CNAME' \
  --output text)"

if [[ -z "$CNAME" || "$CNAME" == "None" ]]; then
  echo "Could not resolve CNAME for EB environment: $ENV_NAME" >&2
  exit 1
fi

# Staging EB serves HTTP only (no TLS on default CNAME).
echo "http://${CNAME}"
