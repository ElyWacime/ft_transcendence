#!/bin/bash

set -e

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed or not in PATH"
  exit 1
fi

mkdir -p ./services/gateway/certs

cat > ./services/gateway/certs/openssl.cnf <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = 10.12.5.4

[v3_req]
keyUsage = keyEncipherment, digitalSignature
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = 10.12.5.4
DNS.1 = localhost
DNS.2 = auth-service
DNS.3 = gateway
DNS.4 = frontend
DNS.5 = game-server
DNS.6 = chat-service
EOF

docker run --rm \
  -v "$PWD/services/gateway/certs:/work" \
  -w /work \
  alpine:3.20 \
  sh -c 'apk add --no-cache openssl >/dev/null 2>&1 && openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes -config openssl.cnf -extensions v3_req'

rm ./services/gateway/certs/openssl.cnf

echo "Self-signed certificates generated in ./services/gateway/certs/"
echo "- certificate.crt"
echo "- private.key"
