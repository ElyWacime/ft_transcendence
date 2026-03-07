#!/bin/bash

NEW_IP=$(ipconfig getifaddr en0 2>/dev/null)

if [ -z "$NEW_IP" ]; then
    echo "Could not detect IP. Enter manually:"
    read NEW_IP
fi

echo "Using IP: $NEW_IP"

sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/frontend/.env"
sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/services/.env"
sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/services/chat-service/.env"
sed -i '' "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/generate-certs.sh"

echo "Done"


### for linux ####

# Get local IP
# NEW_IP=$(ip route get 1 | awk '{print $7; exit}')

# if [ -z "$NEW_IP" ]; then
#     echo "Could not detect IP. Enter manually:"
#     read NEW_IP
# fi

# echo "Using IP: $NEW_IP"

# sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/frontend/.env"
# sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/services/.env"
# sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/services/chat-service/.env"
# sed -i "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$NEW_IP/g" "/Users/welyousf/ft_transcendence/generate-certs.sh"

# echo "Done"