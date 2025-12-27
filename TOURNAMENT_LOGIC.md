# 4-Player Tournament Logic

## Overview
Simple single-elimination tournament for exactly 4 players. 3 total matches.

## Tournament Structure

### Round 1 (Semi-Finals)
- **Match 1**: Player 1 vs Player 2
- **Match 2**: Player 3 vs Player 4

### Round 2 (Final)
- **Match 3**: Winner of Match 1 vs Winner of Match 2

## How It Works

### Step 1: Create Tournament
```
POST /api/tournaments
Body: { "label": "My Tournament" }
Returns: { "id": tournament_id }
```

### Step 2: 4 Players Join
```
POST /api/tournaments/:id/join
Body: { "userId": player_id }
Repeat 4 times (one for each player)
```

### Step 3: Start Tournament
```
POST /api/tournaments/:id/start
Creates 2 matches automatically for Round 1
```

### Step 4: Play Matches
Players play Match 1 and Match 2. When each finishes:
```
POST /api/tournaments/:id/match/:matchId/finish
Body: { "winnerId": player_id }
```

### Step 5: Final Match
After both Round 1 matches finish, the final match is created automatically.
Players play the final. When finished:
```
POST /api/tournaments/:id/match/:matchId/finish
Body: { "winnerId": player_id }
```

### Step 6: Tournament Complete
After the final match, tournament status becomes `FINISHED` and Winner_Id is set.

## Check Status Anytime
```
GET /api/tournaments/:id
Returns:
- tournament: { id, Label, result, Winner_Id, ... }
- matches: [ { id, P1_Id, P2_Id, round, gameStatus, Winner_Id, ... }, ... ]
- participants: [ { id, User_name }, ... ]
```

## Database Tables Used

- **Tournament**: Stores tournament info (label, status, winner)
- **Participate_Tournament**: Links players to tournament
- **Match**: Stores match info (players, round, winner, status)

## Key Fields

### Tournament
- `result`: 'PENDING' → 'PLAYING' → 'FINISHED'
- `Winner_Id`: ID of tournament winner (set when finished)

### Match
- `round`: 1 (Semi-Final) or 2 (Final)
- `gameStatus`: 'PENDING' → 'PLAYING' → 'FINISHED'
- `Winner_Id`: ID of match winner
- `P1_Id`, `P2_Id`: The two players

## Simple Logic Flow

1. **Create tournament** → status = PENDING
2. **4 players join** → they're added to Participate_Tournament
3. **Start tournament** → status = PLAYING, create 2 Round 1 matches
4. **Finish Match 1 & 2** → when both done, auto-create final match
5. **Finish final match** → tournament status = FINISHED, Winner_Id set

No fancy logic. No complex scheduling. Just:
- Check if we have 4 players before starting
- Check if both Round 1 matches are done, then create Round 2
- Check if Round 2 is done, then finish tournament
