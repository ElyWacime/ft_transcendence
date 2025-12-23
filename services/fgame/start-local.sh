#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export PORT="${PORT:-3001}"
export JWT_ACCESS_SECRET="${JWT_ACCESS_SECRET:-supersecretkey}"
exec node index.js
