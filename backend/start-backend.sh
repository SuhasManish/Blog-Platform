#!/usr/bin/env bash
set -euo pipefail

REGION="ap-south-1"

export DATABASE_URL="$(aws ssm get-parameter \
  --name '/blog-platform/prod/DATABASE_URL' \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text \
  --region "$REGION")"

export JWT_SECRET="$(aws ssm get-parameter \
  --name '/blog-platform/prod/JWT_SECRET' \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text \
  --region "$REGION")"

export NODE_ENV=production
export DATABASE_SSL=true
export PORT=5000
export AWS_REGION=ap-south-1
export S3_BUCKET=blog-platform-india

exec node server.js
