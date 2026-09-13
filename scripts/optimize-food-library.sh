#!/usr/bin/env bash
# Daily food_library maintenance (ensure indexes + ANALYZE + health report)
# Usage:
#   APP_URL=https://ricetrack.vercel.app CRON_SECRET=... ./scripts/optimize-food-library.sh
set -euo pipefail
: "${APP_URL:?Set APP_URL e.g. https://ricetrack.vercel.app}"
: "${CRON_SECRET:?Set CRON_SECRET (must match Vercel env)}"
BASE="${APP_URL%/}"
echo "→ ${BASE}/api/library/optimize"
curl -fsS -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  "${BASE}/api/library/optimize"
echo
