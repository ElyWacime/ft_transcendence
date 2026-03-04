#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="./services/gateway/certs"
CERT_FILE="$CERT_DIR/dev.crt"
KEY_FILE="$CERT_DIR/dev.key"

detect_host_ip() {
  local detected
  detected="$(ip route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i == "src") {print $(i+1); exit}}')"
  if [[ -z "${detected}" ]]; then
    detected="$(hostname -I 2>/dev/null | awk '{print $1}')"
  fi
  printf '%s' "${detected:-127.0.0.1}"
}

HOST_IP="${DEV_HOST_IP:-$(detect_host_ip)}"

mkdir -p "$CERT_DIR"

if [[ -f "$CERT_FILE" && -f "$KEY_FILE" ]] \
  && grep -q "BEGIN CERTIFICATE" "$CERT_FILE" \
  && grep -q "BEGIN PRIVATE KEY" "$KEY_FILE" \
  && openssl x509 -in "$CERT_FILE" -noout -text 2>/dev/null | grep -q "IP Address:${HOST_IP}"; then
  echo "TLS certificate already exists: $CERT_FILE"
  exit 0
fi

rm -f "$CERT_FILE" "$KEY_FILE"

openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -days 3650 \
  -subj "/C=MA/ST=Local/L=Local/O=42/OU=ft_transcendence/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:${HOST_IP}"

echo "Generated self-signed certificate:"
echo "  - $CERT_FILE"
echo "  - $KEY_FILE"
echo "  - SAN includes IP: $HOST_IP"
