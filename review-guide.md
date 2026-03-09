# 📋 ft_transcendence — Evaluation Review Guide

> Everything you need to know and explain during the review.

---

## 1. Tech Stack — What We Used & Why

### Architecture Overview

```
┌─────────────┐
│   Browser    │
└──────┬──────┘
       │ HTTPS (443)
┌──────▼──────┐
│    Nginx    │  ← TLS termination, reverse proxy, routing
│   Gateway   │
└──┬──┬──┬──┬─┘
   │  │  │  │
   │  │  │  └──► Frontend       (React + Vite, port 5173)
   │  │  └─────► Auth Service   (Fastify + Prisma, port 8000)
   │  └────────► Game Service   (Fastify + WebSocket, port 3000)
   └───────────► Chat Service   (Fastify + Socket.IO, port 3700)
```

### Why This Stack?

| Technology | Role | Why We Chose It |
|------------|------|-----------------|
| **Fastify (Node.js)** | Backend framework | Required by the subject. Fastest Node.js framework, built-in plugin system, schema validation, TypeScript support |
| **TypeScript** | Frontend + Auth service | Type safety, catches errors at compile time, better IDE support, required by the subject for frontend |
| **React 18** | Frontend UI | Component-based architecture, rich ecosystem, hooks for state management, large community |
| **Vite** | Frontend build tool | Instant HMR (hot module replacement), faster than Webpack, native ES modules support |
| **SQLite** | Database | Required by the subject. Zero-config, no separate DB server needed, file-based, lightweight |
| **Prisma ORM** | Auth DB access | Type-safe database queries, auto-generated client, migrations, works perfectly with SQLite |
| **Nginx** | Reverse proxy/gateway | Industry standard, handles TLS termination, routes to microservices, serves static files, WebSocket upgrade support |
| **Docker Compose** | Orchestration | Isolates each service, reproducible builds, easy deployment, network isolation between services |
| **Socket.IO** | Chat real-time | Built-in rooms, reconnection, fallback to polling, event-based communication |
| **Native WebSocket (ws)** | Game real-time | Lower latency than Socket.IO (no overhead), direct binary support, better for 60fps game state |
| **JWT (Access + Refresh)** | Authentication | Stateless auth, no session storage needed, works across microservices, refresh rotation for security |
| **bcrypt** | Password hashing | Industry standard, salted hashing, configurable work factor (we use 10 rounds) |
| **Zod** | Schema validation | Runtime type validation for API inputs, integrates with Fastify's type provider |
| **ShadCN/Radix UI** | UI components | Accessible, unstyled primitives we can customize, not a full UI library (follows subject rules) |

### Why Microservices?

We split the backend into **3 independent services** because:
1. **Separation of concerns** — Auth handles users, Game handles matches, Chat handles messaging
2. **Independent scaling** — Game service handles heavy WebSocket traffic, Chat uses Socket.IO, Auth is simple REST
3. **Independent deployment** — Can update one service without affecting others
4. **Technology flexibility** — Auth uses TypeScript + Prisma, Game/Chat use JavaScript + raw SQLite
5. **Fault isolation** — If the game service crashes, users can still log in and chat

### Why Two Different WebSocket Implementations?

| | Game Service | Chat Service |
|---|---|---|
| **Library** | `ws` (native WebSocket) | Socket.IO |
| **Reason** | Need raw speed for 60fps game loop, minimal overhead per frame | Need rooms, reconnection, event namespacing for chat features |
| **Protocol** | JSON messages with `type` field | Socket.IO events (emit/on) |

---

## 2. User Management — What to Explain

### Registration Flow
1. User submits email + password + username
2. **Validation**: Zod schema checks email format, password ≥ 6 chars
3. **Uniqueness**: Check email AND username don't already exist in DB
4. **Security**: Password hashed with bcrypt (10 salt rounds) — we never store plain text
5. **Storage**: User created in Prisma/SQLite with a CUID as ID
6. **Default avatar**: Every user gets a default avatar URL if none provided

### Login Flow
1. Find user by email → verify password with `bcrypt.compare()`
2. Generate **access token** (JWT, 15 min expiry) with payload `{ id, email, username }`
3. Generate **refresh token** (JWT, 7 day expiry) stored in DB
4. Refresh token set as **httpOnly cookie** (not accessible via JavaScript — prevents XSS theft)
5. Access token returned in response body for `Authorization: Bearer` header usage

### Token Refresh Flow (Silent Refresh)
1. Frontend detects access token expired (or on page load)
2. Sends request to `/refresh` — browser automatically includes the httpOnly cookie
3. Server verifies refresh token matches the one in DB
4. Issues **new** access token + **new** refresh token (rotation — old refresh token invalidated)
5. User stays logged in without re-entering credentials

### Profile Updates — How Each Works

| Feature | Endpoint | Security | Cross-Service Sync |
|---------|----------|----------|-------------------|
| **Change Email** | `PUT /update_email` | Requires current password + JWT | Syncs to game-service via `POST /sync-email` |
| **Change Password** | `PUT /update_password` | Requires current password + JWT | Forces logout (clears refresh cookie) |
| **Change Username** | `PUT /update_name` | Requires current password + JWT | Syncs to chat-service via `POST /chat/sync-user` |
| **Change Picture** | `PUT /update_picture` | Requires JWT | Stored as base64 → Buffer in Prisma `Bytes` field |

### Key Points to Mention
- **Every profile change requires password verification** — prevents unauthorized changes even if someone steals your session
- **Cross-service sync** — when username changes, we notify the chat service so messages show the new name
- **Token reissuance** — after email/username change, new JWTs are issued with updated payload so the whole system reflects the change immediately
- **Avatar storage** — images stored directly in SQLite as binary data (Prisma `Bytes` type), with MIME type derived from file extension. Max 2MB enforced on frontend

---

## 3. AI Opponent — How It Works (IMPORTANT: Be Ready to Explain in Detail)

### Overview
The AI is a **client-side physics-prediction algorithm**. It does NOT use A* (which is prohibited by the subject). Instead, it **simulates the ball's trajectory forward in time** to predict where it will arrive.

### The Algorithm Step by Step

#### Step 1: Snapshot the Game State (once per second)
The AI only recalculates its prediction **every 1 second** (subject requirement: "AI can only refresh its view of the game once per second"). Between recalculations, it moves toward the last predicted position.

```
Every 1 second:
  → Take snapshot of: ball position, ball velocity, paddle positions, canvas dimensions
  → Run prediction algorithm
  → Get target Y position
  → Move toward that Y until next recalculation
```

#### Step 2: Trajectory Prediction (`predictBallPosition`)

**Case A — Ball moving toward AI (velocityX > 0):**
1. Calculate time until ball reaches AI paddle's X position: `timeToReach = (aiPaddleX - ballX) / velocityX`
2. Calculate raw Y position: `predictedY = ballY + velocityY × timeToReach`
3. **Simulate wall bounces**: The ball bounces off top/bottom walls. We simulate this by "folding" the Y coordinate:
   - Divide the total Y travel into segments of `gameHeight`
   - Each segment represents one bounce
   - Odd segments = ball traveling down, even = traveling up
   - Final Y = position within the current segment
4. Return the predicted Y (where the ball will be when it reaches the AI paddle)

**Case B — Ball moving away from AI (velocityX < 0):**
1. First simulate ball reaching the **player's paddle** (left side)
2. Assume the player **will hit it back** (ball bounces, velocityX reverses)
3. Apply **1.2× speed acceleration** (same as the collision physics) capped at speed² < 169
4. Then simulate the return path back to the AI paddle
5. This handles **multi-bounce predictions** — the AI thinks ahead even when the ball is going away

**Safety**: Maximum 100 iterations to prevent infinite loops. Falls back to center if calculation fails.

#### Step 3: Add Noise by Difficulty

| Difficulty | Noise Range | Effect |
|------------|-------------|--------|
| **EASY** | ±40 pixels | AI frequently misses — large random offset on prediction |
| **MEDIUM** | ±15 pixels | AI is decent but makes mistakes |
| **HARD** | ±0 pixels | Perfect prediction — almost never misses |

Noise formula: `predictedY + random(-noise, +noise)`, clamped to canvas bounds.

#### Step 4: Smart Movement (`getAIMove`)
The AI doesn't just rush to the predicted position. It implements **human-like behavior**:

1. Calculate distance to target: `distance = targetY - paddleCenterY`
2. Calculate `urgency = |ballX - paddleX| / canvasWidth` (0 = ball is here, 1 = ball is far away)
3. **Delay movement**: If `urgency > 0.7` (ball is far away), the AI **waits** — it doesn't move until the ball gets closer. This simulates human reaction time.
4. **Dead zone**: If distance < 5 pixels, don't move (prevents jitter)
5. Return `UP` or `DOWN` based on which direction closes the gap

### Why This AI Approach?

1. **Not A\* algorithm** — compliant with the subject's prohibition
2. **Physics-based** — the AI uses the same physics as the game (bounce angles, speed acceleration), making it realistic
3. **Human-like** — the 1-second refresh rate + movement delay + noise make the AI behave like a human, not a robot
4. **Can win occasionally** — on HARD difficulty the AI is very strong, on EASY it's beatable. Subject requires "capability to win occasionally"
5. **Simulates keyboard input** — the AI returns UP/DOWN/IDLE actions (same as keyboard W/S/nothing), not direct paddle positions. Subject requires "simulate keyboard input"

### Key Points for Evaluators
- **"How does your AI work?"** → It predicts the ball's landing position using forward trajectory simulation with wall-bounce physics, recalculates every 1 second, and adds noise based on difficulty
- **"Why not A\*?"** → A* is prohibited. Also, A* is for pathfinding in grids — it doesn't make sense for Pong. Physics prediction is the correct approach for this type of game
- **"Can the AI win?"** → Yes, especially on HARD difficulty where it has perfect prediction. On EASY it intentionally misses due to ±40px noise
- **"Does the AI cheat?"** → No. It only sees the game state once per second (same data a human would see). It uses physics simulation, not instant position knowledge
- **"How does the AI simulate keyboard input?"** → The `getAIMove()` method returns `UP`, `DOWN`, or `IDLE` — these are the same actions as pressing W, S, or no key. The game loop treats the AI paddle the same as a human-controlled paddle

---

## 4. Dashboard & Stats — What to Explain

### How Stats Are Computed

| Stat | Computation | SQL Logic |
|------|-------------|-----------|
| **Total Matches** | Count all FINISHED matches where the user is P1, P2, P3, or P4 | `WHERE (P1_Id=? OR P2_Id=? OR P3_Id=? OR P4_Id=?) AND gameStatus='FINISHED'` |
| **Wins** | Count matches where user's side has higher score | Left side (P1/P3): win when `score1 ≥ score2`. Right side (P2/P4): win when `score2 ≥ score1` |
| **Losses** | `totalMatches - wins` | Computed, not queried |
| **Win Rate** | `(wins / totalMatches) × 100` | Computed in JavaScript, rounded to 2 decimals |
| **Tournaments Played** | Count distinct `T_Id` values in user's matches | `SELECT COUNT(DISTINCT T_Id) WHERE T_Id IS NOT NULL` |
| **Tournament Wins** | Tournaments where user won **2 matches** (semifinal + final) | `GROUP BY T_Id HAVING COUNT(*) = 2` where `Winner_Id = userId` |

### Dashboard Data Flow (Two-Service Merge)
```
Frontend calls getCompleteUserData(userId):
  1. GET /api/users/user-info/{userId}  → Auth Service → returns { name, email, avatar, createdAt }
  2. GET /api/dashboard/{userId}        → Game Service → returns { totalMatches, wins, losses, winRate, lastMatch, ... }
  3. Merge both responses into one object → render the dashboard
```

### Why Two Services?
- **Auth service** owns user identity (name, email, avatar)
- **Game service** owns match data (scores, results, history)
- Neither service has the full picture alone — the frontend merges them
- This is a natural consequence of our **microservices architecture**

### Match History
- `POST /api/game/allmatch` returns all non-PENDING matches for a user
- Each match includes: player IDs, scores, mode (1v1/2v2), date, status, winner
- Frontend color-codes: 🟢 green = won, 🔴 red = lost, 🟡 yellow = in progress

---

## 5. OAuth (GitHub) — What to Explain

### Flow
```
1. User clicks "Login with GitHub"
2. → Redirect to GitHub OAuth authorize URL (with client_id + scopes)
3. → User authorizes on GitHub
4. → GitHub redirects back to /auth/github/callback?code=XXX
5. → Server exchanges code for access_token with GitHub API
6. → Server fetches user profile + primary email from GitHub
7. → findOrCreate user in our DB (password field set to empty string for OAuth users)
8. → Issue JWT access + refresh tokens
9. → Redirect to frontend with tokens
```

### Key Points
- OAuth users **cannot** use the "change password" feature (they have no password)
- OAuth users get their GitHub email and username imported
- If the user already exists with that email, we update their record instead of creating a duplicate

---

## 6. Game Architecture — What to Explain

### Server-Authoritative Design
- **All game physics run on the server** at 60 ticks/second
- Client only sends **key inputs** (UP/DOWN key pressed/released)
- Server computes ball position, collisions, scoring, and sends full state back
- **Why?** Prevents cheating — client can't manipulate ball position or scores

### Game State Broadcast
Every tick (~16.67ms), the server sends to all players:
```json
{
  "ballX": 400, "ballY": 300,
  "paddle1Y": 250, "paddle2Y": 200,
  "score1": 3, "score2": 2,
  "gameStatus": "PLAYING"
}
```

### Matchmaking
1. Player sends `REGISTER` with mode (1v1 or 2v2) + JWT
2. Server checks for existing pending room with open slots
3. If found → join that room. If not → create new room
4. When room is full (2 for 1v1, 4 for 2v2) → game starts automatically

### Tournament System
- 4 players join → auto-generates bracket: 2 semifinals + 1 final
- Both semifinal players must click "Ready" → match starts
- Winners advance to final automatically
- **In-memory only** — not persisted to DB (match results ARE persisted, but bracket state isn't)

---

## 7. Chat System — What to Explain

### Features
- **Direct messaging** between users (1-on-1 conversations)
- **Block/unblock** — blocked users can't send you messages
- **Friend system** — add/remove friends, see friend status
- **Game invites** — invite someone to play Pong through the chat
- **Real-time** via Socket.IO — messages appear instantly

### Why Socket.IO for Chat (vs native WebSocket for Game)?
- Chat needs **rooms** (conversations) — Socket.IO has built-in room support
- Chat needs **reconnection** — Socket.IO auto-reconnects with buffering
- Chat needs **event names** — cleaner than parsing JSON message types
- Game needs **raw speed** — Socket.IO adds overhead that matters at 60fps

---

## 8. Security Measures — What to Explain

| Measure | Implementation |
|---------|---------------|
| **HTTPS** | Self-signed TLS certificates, Nginx terminates SSL |
| **HSTS** | `Strict-Transport-Security` header forces HTTPS |
| **Password hashing** | bcrypt with 10 salt rounds — never stored in plain text |
| **JWT tokens** | Access (15min) + Refresh (7 days) with rotation |
| **httpOnly cookies** | Refresh token stored in httpOnly cookie — JavaScript can't access it |
| **CORS** | Configured to allow only our domain |
| **Password verification** | Every profile change requires current password |
| **Input validation** | Zod schemas validate all API inputs |

---

## 9. Quick Answers for Common Evaluator Questions

| Question | Answer |
|----------|--------|
| **"Why Fastify over Express?"** | Required by subject. Also faster, built-in validation, TypeScript support, plugin architecture |
| **"Why SQLite?"** | Required by subject. Zero-config, embedded, no separate server needed |
| **"Why not use a full UI library?"** | Subject prohibits libraries that solve an entire module. ShadCN gives unstyled primitives we customize ourselves |
| **"How do you prevent cheating in online Pong?"** | Server-authoritative — all physics run server-side, client only sends key inputs |
| **"What happens if a player disconnects?"** | Their pending match is cleaned up. Active matches continue (opponent wins by default when score reached) |
| **"How does cross-service auth work?"** | JWT tokens are verified independently by each service using the same secret. Game/Chat services validate tokens by calling the auth service's `/validate_token` endpoint or verifying locally |
| **"Why microservices?"** | Separation of concerns, independent scaling, fault isolation, technology flexibility |
| **"How is the AI fair?"** | It only sees game state once per second, uses physics prediction (not cheating), adds noise based on difficulty, simulates keyboard input |
