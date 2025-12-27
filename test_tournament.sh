#!/bin/bash

echo "=== Testing Tournament System ==="
echo ""

# Create users in DB first
echo "Creating test users..."
docker exec ft_transcendence-pong-server-1 bash -c "
sqlite3 /app/database.sqlite <<SQLEOF
DELETE FROM Match WHERE T_Id IS NOT NULL;
DELETE FROM Participate_Tournament;
DELETE FROM Tournament;
DELETE FROM Users;
INSERT INTO Users (id, email, User_name, User_password) VALUES 
  ('user1', 'u1@test.com', 'User1', 'pass'),
  ('user2', 'u2@test.com', 'User2', 'pass'),
  ('user3', 'u3@test.com', 'User3', 'pass'),
  ('user4', 'u4@test.com', 'User4', 'pass');
SQLEOF
"

echo "✅ Users created"
echo ""

# Create tournament
echo "Creating tournament..."
T_ID=$(curl -s -X POST http://10.30.238.84:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{"label":"Test Tournament"}' | grep -o '"id":[0-9]*' | cut -d: -f2)
echo "✅ Tournament created: ID=$T_ID"
echo ""

# Join 4 players
echo "Joining players..."
for i in {1..4}; do
  RESULT=$(curl -s -X POST http://10.30.238.84:3000/api/tournaments/$T_ID/join \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"user$i\"}")
  echo "  Player $i: $RESULT"
done
echo "✅ All players joined"
echo ""

# Check status
echo "Tournament status before start:"
curl -s http://10.30.238.84:3000/api/tournaments/$T_ID | python3 -m json.tool
echo ""

# Start tournament
echo "Starting tournament..."
curl -s -X POST http://10.30.238.84:3000/api/tournaments/$T_ID/start \
  -H "Content-Type: application/json" \
  -d '{}'
echo ""
echo "✅ Tournament started"
echo ""

# Check matches
echo "Checking matches in database..."
docker exec ft_transcendence-pong-server-1 sqlite3 /app/database.sqlite << EOF
.headers on
.mode column
SELECT id, P1_Id, P2_Id, round, gameStatus FROM Match WHERE T_Id = $T_ID;
EOF
echo ""

echo "=== Test Complete ==="
