#!/bin/bash
# Re-alias ERM domains to latest production deploy
# Run after each deploy to fix Vercel domain alias issue

set -e

# Get latest production deployment URL
LATEST=$(npx vercel ls exoticrentalsmontreal 2>&1 | grep "Production" | grep "Ready" | head -1 | awk '{print $3}')

if [ -z "$LATEST" ]; then
  echo "No ready production deployment found"
  exit 1
fi

echo "Latest deploy: $LATEST"

# Re-alias both domains
npx vercel alias "$LATEST" www.exoticrentalsmontreal.com 2>&1 | tail -1
npx vercel alias "$LATEST" exoticrentalsmontreal.com 2>&1 | tail -1

echo "Done. Domains now point to $LATEST"