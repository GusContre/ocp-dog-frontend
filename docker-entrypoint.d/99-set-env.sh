#!/bin/sh
set -eu

api_url=${FRONTEND_API_URL:-http://localhost:5001}
api_url=${api_url%/}
escaped=$(printf '%s' "$api_url" | sed 's/"/\\"/g')

cat >/usr/share/nginx/html/env-config.js <<EOC
window.__APP_CONFIG__ = {
  FRONTEND_API_URL: "${escaped}"
};
EOC
