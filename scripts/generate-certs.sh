#!/bin/bash

mkdir -p ./services/gateway/certs

openssl req -x509 -newkey rsa:4096 -keyout ./services/gateway/certs/private.key -out ./services/gateway/certs/certificate.crt -days 365 -nodes \
  -subj "/CN=10.30.239.32"

echo "Self-signed certificates generated in ./services/gateway/certs/"
echo "- certificate.crt"
echo "- private.key"
