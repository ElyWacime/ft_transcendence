#!/bin/bash

set -e

echo "Generating JWT and Cookie secrets..."

JWT_ACCESS_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\n')
COOKIE_SECRET=$(openssl rand -base64 64 | tr -d '\n')

echo "✓ Secrets generated"

ENV_FILE_1="$PWD/services/.env"
if [ -f "$ENV_FILE_1" ]; then
    sed -i.bak "s|^JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET|" "$ENV_FILE_1"
    sed -i.bak "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" "$ENV_FILE_1"
    sed -i.bak "s|^COOKIE_SECRET=.*|COOKIE_SECRET=$COOKIE_SECRET|" "$ENV_FILE_1"
    echo "✓ Updated $ENV_FILE_1"
else
    echo "⚠ Warning: $ENV_FILE_1 not found"
fi

echo ""
echo "✅ JWT and Cookie secrets updated successfully!"
echo ""
echo "⚠️  IMPORTANT: Restart all services for changes to take effect:"
echo "   docker-compose down && docker-compose up -d"
echo ""
echo "Note: All existing user sessions will be invalidated."
