#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONT_ENV="$ROOT_DIR/frontend/.env"
SERVICES_ENV="$ROOT_DIR/services/.env"

detect_host_ip() {
  local detected
  detected="$(ip route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i == "src") {print $(i+1); exit}}')"
  if [[ -z "${detected}" ]]; then
    detected="$(hostname -I 2>/dev/null | awk '{print $1}')"
  fi
  printf '%s' "${detected:-127.0.0.1}"
}

HOST_IP="${DEV_HOST_IP:-$(detect_host_ip)}"

if [[ ! -f "$FRONT_ENV" || ! -f "$SERVICES_ENV" ]]; then
  echo "Missing env files. Expected:"
  echo "  - $FRONT_ENV"
  echo "  - $SERVICES_ENV"
  exit 1
fi

sed -i "s|^VITE_API_URL=.*$|VITE_API_URL=https://${HOST_IP}|" "$FRONT_ENV"
sed -i "s|^VITE_DOMAIN=.*$|VITE_DOMAIN=${HOST_IP}|" "$FRONT_ENV"

sed -i "s|^DOMAIN=.*$|DOMAIN=${HOST_IP}|" "$SERVICES_ENV"
sed -i "s|^GITHUB_CALLBACK_URL=.*$|GITHUB_CALLBACK_URL=https://${HOST_IP}/api/users/auth/github/callback|" "$SERVICES_ENV"

echo "Updated env files to machine IP: ${HOST_IP}"
echo "  - frontend/.env"
echo "  - services/.env"

echo "Regenerating cert to include SAN IP: ${HOST_IP}"
DEV_HOST_IP="$HOST_IP" bash "$ROOT_DIR/scripts/generate-dev-cert.sh"

echo "Done."
