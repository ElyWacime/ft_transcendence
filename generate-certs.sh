#!/bin/bash

# Create certificates directory in the gateway folder
mkdir -p ./services/gateway/certs

# Generate self-signed certificate for nginx (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout ./services/gateway/certs/private.key -out ./services/gateway/certs/certificate.crt -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=10.12.11.5"

echo "Self-signed certificates generated in ./services/gateway/certs/"
echo "- certificate.crt"
echo "- private.key"
