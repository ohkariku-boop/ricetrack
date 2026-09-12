#!/usr/bin/env bash
# Daily food_library maintenance (ANALYZE + index health report)
# Usage: APP_URL=https://ricetrack.vercel.app CRON_SECRET=... ./scripts/optimize-food-library.sh
set -euo pipefail
: "${APP_URL:?Set APP_URL}"
: "${CRON_SECRET:?Set CRON_SECRET}"
curl -fsS -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/library/optimize"
echo
