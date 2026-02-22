#!/bin/bash

# Refresh Token Test Script
# This script tests the complete refresh token flow

echo "🧪 Testing Refresh Token Implementation"
echo "========================================="

# Configuration
BASE_URL="http://localhost:8000"
EMAIL="bbbb@bbbb.bbbb"
PASSWORD="bbbb@bbbb.bbbb"

echo ""
echo "1️⃣  Testing Login..."
echo "-------------------"

# Login and capture response
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract tokens
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Login failed - no access token received"
  exit 1
fi

echo "✅ Login successful"
echo "   Access Token: ${ACCESS_TOKEN:0:20}..."
echo "   Refresh Token: ${REFRESH_TOKEN:0:20}..."

echo ""
echo "2️⃣  Testing Protected Endpoint with Access Token..."
echo "---------------------------------------------------"

ME_RESPONSE=$(curl -s -X GET "$BASE_URL/" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Protected endpoint response:"
echo "$ME_RESPONSE" | jq '.' 2>/dev/null || echo "$ME_RESPONSE"

if echo "$ME_RESPONSE" | grep -q "ok"; then
  echo "✅ Access token works"
else
  echo "⚠️  Protected endpoint response unexpected"
fi

echo ""
echo "3️⃣  Testing Refresh Token Endpoint..."
echo "--------------------------------------"
echo "⏳ Waiting 2 seconds (simulating real-world delay)..."
sleep 2

REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/refresh" \
  -H "Authorization: Bearer $REFRESH_TOKEN")

echo "Refresh Response:"
echo "$REFRESH_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')
NEW_REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.refreshToken')

if [ "$NEW_ACCESS_TOKEN" == "null" ] || [ -z "$NEW_ACCESS_TOKEN" ]; then
  echo "❌ Refresh failed - no new access token"
  exit 1
fi

echo "✅ Token refresh successful"
echo "   New Access Token: ${NEW_ACCESS_TOKEN:0:20}..."
echo "   New Refresh Token: ${NEW_REFRESH_TOKEN:0:20}..."

echo ""
echo "4️⃣  Testing New Access Token..."
echo "--------------------------------"

NEW_ME_RESPONSE=$(curl -s -X GET "$BASE_URL/" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

echo "Protected endpoint with new token:"
echo "$NEW_ME_RESPONSE" | jq '.' 2>/dev/null || echo "$NEW_ME_RESPONSE"

if echo "$NEW_ME_RESPONSE" | grep -q "ok"; then
  echo "✅ New access token works"
else
  echo "⚠️  New access token might not be working"
fi

echo ""
echo "5️⃣  Testing Invalid Token..."
echo "----------------------------"

INVALID_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/" \
  -H "Authorization: Bearer invalid_token")

HTTP_STATUS=$(echo "$INVALID_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" == "401" ]; then
  echo "✅ Invalid token correctly rejected (401)"
else
  echo "⚠️  Expected 401, got: $HTTP_STATUS"
fi

echo ""
echo "6️⃣  Testing Old Refresh Token (should fail)..."
echo "-----------------------------------------------"

OLD_REFRESH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/refresh" \
  -H "Authorization: Bearer $REFRESH_TOKEN")

OLD_HTTP_STATUS=$(echo "$OLD_REFRESH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$OLD_HTTP_STATUS" == "401" ]; then
  echo "✅ Old refresh token correctly rejected (token rotation working)"
else
  echo "⚠️  Old refresh token still works - token rotation might not be working"
  echo "   Status: $OLD_HTTP_STATUS"
fi

echo ""
echo "========================================="
echo "🎉 Test Complete!"
echo "========================================="
