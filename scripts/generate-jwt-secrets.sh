#!/usr/bin/env bash

set -e

echo "Generating secrets..."

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is required but not installed or not in PATH"
    exit 1
fi

generate_secret() {
    docker run --rm alpine:3.20 sh -c 'apk add --no-cache openssl >/dev/null 2>&1 && openssl rand -base64 64' | tr -d '\r\n'
}

INTERNAL_SERVICE_KEY=$(generate_secret)
JWT_ACCESS_SECRET=$(generate_secret)
COOKIE_SECRET=$(generate_secret)

echo "Secrets generated"

MAIN_ENV="$PWD/services/.env"
CHAT_ENV="$PWD/services/chat-service/.env"

if [ -f "$MAIN_ENV" ]; then
    echo "Updating secrets in $MAIN_ENV ..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^INTERNAL_SERVICE_KEY=.*|INTERNAL_SERVICE_KEY=$INTERNAL_SERVICE_KEY|" "$MAIN_ENV"
        sed -i '' "s|^JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET|" "$MAIN_ENV"
        sed -i '' "s|^COOKIE_SECRET=.*|COOKIE_SECRET=$COOKIE_SECRET|" "$MAIN_ENV"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i  "s|^INTERNAL_SERVICE_KEY=.*|INTERNAL_SERVICE_KEY=$INTERNAL_SERVICE_KEY|" "$MAIN_ENV"
        sed -i  "s|^JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET|" "$MAIN_ENV"
        sed -i  "s|^COOKIE_SECRET=.*|COOKIE_SECRET=$COOKIE_SECRET|" "$MAIN_ENV"
    fi
    echo "Updated $MAIN_ENV"
else
    echo "Warning: $MAIN_ENV not found"
fi

if [ -f "$CHAT_ENV" ]; then
    echo "Updating INTERNAL_SERVICE_KEY in $CHAT_ENV ..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^INTERNAL_SERVICE_KEY=.*|INTERNAL_SERVICE_KEY=$INTERNAL_SERVICE_KEY|" "$CHAT_ENV"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i "s|^INTERNAL_SERVICE_KEY=.*|INTERNAL_SERVICE_KEY=$INTERNAL_SERVICE_KEY|" "$CHAT_ENV"
    fi
    echo "Updated $CHAT_ENV"
else
    echo "Warning: $CHAT_ENV not found"
fi

echo "All secrets updated successfully!"