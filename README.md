# PONG ARENA

A retro gaming tournament platform built with React, Node.js, and Docker. Play classic Pong games in tournament mode, against AI, or online with other players.

## PROJECT STRUCTURE

frontend/              - React + Vite frontend application
services/
  auth-service/       - JWT authentication and user management
  chat-service/       - Real-time chat functionality
  fgame/              - Game server and game logic
  data-base/          - Database schemas
  gateway/            - Nginx reverse proxy

## FEATURES

- Tournament Mode: 4-player elimination brackets with dynamic seeding
- 1 vs 1 Local: Play on the same keyboard
- 1 vs 1 Online: Real-time multiplayer with WebSocket
- 2 vs 2 Online: Team-based matches
- AI Mode: Challenge the computer opponent
- Player Profiles: Track stats, wins, losses, and win rates
- Chat System: Real-time messaging between players
- User Authentication: JWT-based secure login

## TECHNOLOGIES

### Frontend:
  - React 18
  - TypeScript
  - Vite
  - React Router
  - Socket.io Client

### Backend:
  - Node.js
  - fastify
  - SQLite
  - WebSocket
  - Socket.io Server

## GAME RULES

- Pong is a 2D paddleboard game
- Players control paddles with keyboard controls
- First to reach the target score wins
- In tournaments, winners advance to the next round
- Online mode uses WebSocket for real-time synchronization

## KEYBOARD CONTROLS

### Local 1v1:
  Player 1: W (up), S (down)
  Player 2: Arrow Up, Arrow Down

### Online / AI:
  Arrow Up: Move paddle up
  Arrow Down: Move paddle down

## ARCHITECTURE

The application uses a microservices architecture:

- Frontend: SPA served by Nginx
- Auth Service: Manages user authentication and profiles
- Game Service: Handles game logic and match results
- Chat Service: Manages real-time messaging
- Gateway: Routes requests to appropriate services

Services communicate via HTTPS and WebSocket protocols.

## PORTS & SERVICES

All traffic goes through the **gateway (Nginx)** — services are not exposed directly.

| Service        | Internal Port | Exposed Port   | Protocol       |
|----------------|---------------|----------------|----------------|
| gateway        | 80 / 443      | 80 / 443       | HTTP → HTTPS   |
| frontend       | 5173          | via gateway    | HTTPS          |
| auth-service   | 8000          | via gateway    | HTTPS          |
| chat-service   | 3700          | via gateway    | HTTPS + WS     |
| game-server    | 3000          | via gateway    | HTTPS + WS     |

Access the app at: `https://localhost`  
HTTP (`http://localhost`) auto-redirects to HTTPS.

## AUTH SERVICE ROUTES (QUICK GUIDE)

Base service: `auth-service` (port `8000` inside Docker).

- **GET /healthcheck**  
  Quick check to confirm the auth service is running.

- **GET /** *(auth required)*  
  Simple protected endpoint used to verify that authentication works.

- **POST /register**  
  Creates a new user account.

- **POST /login**  
  Logs a user in and returns access credentials.

- **POST /logout** *(auth required)*  
  Logs the current user out and clears their active session.

- **POST /refresh**  
  Renews expired/old login tokens so the user can stay signed in.

- **PUT /update_email** *(auth required)*  
  Changes the current user's email address.

- **PUT /update_password** *(auth required)*  
  Changes the current user's password.

- **PUT /update_username** *(auth required)*  
  Changes the current user's display name/username.

- **PUT /update_image** *(auth required)*  
  Updates the current user's profile picture.

- **POST /validate_token**  
  Checks whether a token is valid and returns basic user info.

- **POST /search-this-name** *(auth required)*  
  Finds a user by username and returns basic user info.

- **GET /get-user/:userId** *(auth required)*  
  Returns a user's name using their user ID.

- **GET /user-info/:userId** *(auth required)*  
  Returns a user's profile details using their user ID.

## GAME / DASHBOARD ROUTES (QUICK GUIDE)

Base service: `game-service` (port `3000` inside Docker).

- **GET /api/dashboard/:identifier** *(auth required)*  
  Returns dashboard statistics and last match for the target user ID in `:identifier`.

## CHAT SERVICE ROUTES (QUICK GUIDE)

Base service: `chat-service` (port `3700` inside Docker).  
Gateway prefix: `/api/chat/*` (gateway rewrites to chat-service routes).

- **POST /api/chat/users/add** *(internal service key required)*  
  Adds/syncs a user in chat DB (used by internal services).

- **POST /api/chat/user/update** *(auth required)*  
  Updates current user's chat username.

- **GET /api/chat/conversations** *(auth required)*  
  Returns current user's conversations list.

- **POST /api/chat/conversations/start** *(auth required)*  
  Starts (or reuses) a conversation with another user.

- **GET /api/chat/conversations/:id/messages** *(auth required)*  
  Returns messages for a conversation if user is a participant.

- **GET /api/chat/friends** *(auth required)*  
  Returns the current user's friends list.

- **POST /api/chat/friends/status** *(auth required)*  
  Checks friendship status with another user.

- **POST /api/chat/friends/add** *(auth required)*  
  Adds another user as friend.

- **POST /api/chat/friends/remove** *(auth required)*  
  Removes another user from friends.

- **POST /api/chat/block/status** *(auth required)*  
  Checks block status with another user.

- **POST /api/chat/block** *(auth required)*  
  Blocks another user.

- **POST /api/chat/unblock** *(auth required)*  
  Unblocks a user previously blocked by you.

- **POST /api/chat/invitations/status** *(auth required)*  
  Checks invitation status (game/friend invitation types).

- **POST /api/chat/invite** *(auth required)*  
  Sends an invitation to another user.

- **POST /api/chat/uninvite** *(auth required)*  
  Cancels a previously sent invitation.

- **WebSocket /socket.io/** *(auth required via token in handshake)*  
  Real-time chat channel and live events (messages, presence, invites).

## FRONTEND ROUTES (AI, DASHBOARD, PROFILE)

These are the main client routes for the requested features:

- **/game-ai**  
  Opens AI mode (single player vs computer).

- **/game**  
  Opens local game mode (same device multiplayer).

- **/game-online** *(protected route)*  
  Opens online game mode (real-time multiplayer).

- **/online-tournament** *(protected route)*  
  Opens online tournament mode.

- **/loading** *(protected route)*  
  Matchmaking/loading screen before online game starts.

- **/result** *(protected route)*  
  Match result screen.

- **/dashboard/:identifier?** *(protected route)*  
  Opens dashboard page. If `identifier` is present, it loads that user's data.

- **/profile** *(protected route)*  
  Opens profile settings page.

- **/profile/change-username**  
  Change username form. Uses `PUT /update_username`.

- **/profile/change-password**  
  Change password form. Uses `PUT /update_password`.

- **/profile/change-picture**  
  Change profile image form. Uses `PUT /update_image`.

- **/profile/change-email**  
  Change email form. Uses `PUT /update_email`.

### requirements
Docker (for arch linux `sudo pacman -S docker`)
GNU make (for arch linux run `sudo pacman -S make`)

## How to run
  # Linux
    Add sudo to Makfile for each command in flcean target in Makefile
    Run make
  # Mac os
    Run make

