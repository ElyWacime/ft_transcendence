#!/usr/bin/env bash

set -e


FILES=(
    "services/env.example:services/.env"
    "services/game-service/env.example:services/game-service/.env"
    "services/chat-service/env.example:services/chat-service/.env"
)

echo "Checking environment templates..."

for entry in "${FILES[@]}"; do
    SOURCE="${entry%%:*}"
    TARGET="${entry#*:}"

    if [ -f "$SOURCE" ]; then
        if [ ! -f "$TARGET" ]; then
            cp "$SOURCE" "$TARGET"
            echo "Created $TARGET from $SOURCE"
        else
            echo "ℹ $TARGET already exists, skipping copy."
        fi
    else
        echo "Warning: $SOURCE not found"
    fi
done