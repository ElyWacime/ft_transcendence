#!/usr/bin/env bash
set -euo pipefail

# Kill existing fgame processes on 3001
pids=$(lsof -iTCP:3001 -sTCP:LISTEN -t 2>/dev/null || true)
if [ -n "$pids" ]; then
  echo "Killing existing processes on port 3001: $pids"
  kill -9 $pids
fi

cd "$(dirname "$0")"
export PORT="${PORT:-3001}"
export JWT_ACCESS_SECRET="${JWT_ACCESS_SECRET:-supersecretkey}"

echo "Starting fgame on port $PORT..."
nohup node index.js >/tmp/fgame.log 2>&1 &
echo "PID: $!"
sleep 1
echo "Logs:"
tail -n 10 /tmp/fgame.log
