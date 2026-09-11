#!/usr/bin/env bash
# Promote approved library_suggestions → food_library
# Usage: APP_URL=https://ricetrack.vercel.app CRON_SECRET=... ./scripts/weekly-library-job.sh
set -euo pipefail
: "${APP_URL:?Set APP_URL}"
: "${CRON_SECRET:?Set CRON_SECRET}"
curl -fsS -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/library/process-weekly"
echo
