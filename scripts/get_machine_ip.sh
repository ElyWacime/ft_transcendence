#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    NEW_IP=$(ipconfig getifaddr en0 2>/dev/null)
    
    if [ -z "$NEW_IP" ]; then
        echo "Could not detect IP. Enter manually:"
        read NEW_IP
    fi
    # read NEW_IP
    echo "Using IP: $NEW_IP (macOS)"
    
    sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/frontend/.env"
    sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/services/.env"
    sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/services/chat-service/.env"
    sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/scripts/generate-certs.sh"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    NEW_IP=$(ip route get 1 | awk '{print $7; exit}')
    
    if [ -z "$NEW_IP" ]; then
        echo "Could not detect IP. Enter manually:"
        read NEW_IP
    fi
    
    echo "Using IP: $NEW_IP (Linux)"
    
    sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/frontend/.env"
    sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/services/.env"
    sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/services/chat-service/.env"
    sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "$PWD/scripts/generate-certs.sh"
    
fi
echo "Done"