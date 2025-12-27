#!/bin/bash
# Test dashboard endpoint directly

echo "Testing dashboard endpoint..."
echo ""

# Test 1: Without token
echo "Test 1: Request without token"
curl -v http://10.30.239.32/api/dashboard/test-id 2>&1 | grep -E "HTTP|error|User"
echo ""

# Test 2: Check if endpoint is reachable
echo "Test 2: Check backend directly"
curl -v http://10.30.239.32:3000/api/dashboard/test-id 2>&1 | grep -E "HTTP|error|User"
echo ""

# Test 3: Check gateway
echo "Test 3: Check gateway health"
curl -v http://10.30.239.32/ 2>&1 | head -5
echo ""

echo "Done. Check the output above."

