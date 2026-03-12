#!/bin/bash

mkdir -p ./services/gateway/certs

cat > ./services/gateway/certs/openssl.cnf <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = 10.12.6.3

[v3_req]
keyUsage = keyEncipherment, digitalSignature
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = 10.12.6.3
DNS.1 = localhost
DNS.2 = auth-service
DNS.3 = gateway
DNS.4 = frontend
DNS.5 = game-server
DNS.6 = chat-service
EOF

openssl req -x509 -newkey rsa:4096 \
  -keyout ./services/gateway/certs/private.key \
  -out ./services/gateway/certs/certificate.crt \
  -days 365 -nodes \
  -config ./services/gateway/certs/openssl.cnf \
  -extensions v3_req

rm ./services/gateway/certs/openssl.cnf

echo "Self-signed certificates generated in ./services/gateway/certs/"
echo "- certificate.crt"
echo "- private.key"
