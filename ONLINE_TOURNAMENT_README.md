# Online Tournament Flow (Backend + Frontend)

This doc explains how the online tournament feature is wired end-to-end, focusing on data flow and reasoning, not UI. It covers the lifecycle from lobby creation to champion, how the frontend talks to the backend, and why the key steps exist.

## High-level architecture
- **Transport**: WebSocket for all tournament mutations and live updates; HTTP only for an initial snapshot (`GET /tournaments-online`).
- **State store**: In-memory map on game-service (`tournaments`), reset on service restart. Broadcasts keep all clients in sync.
- **Match play**: VIP matches per bracket slot, managed over the same WebSocket infra used for regular games.
- **Auth**: JWT token sent with every WS payload so the server can identify the player.

## Lifecycle and states
Tournaments move through a simple state machine:
- `waiting`: <4 players, no bracket yet.
- `semifinals`: 4 players locked; two semifinal slots created.
- `finals`: both semifinal winners known; final slot filled.
- `completed`: champion decided.

Slots:
- **Semifinals**: two slots with `player1`, `player2`, `winner`, `ready`, `readyAt`, `matchId`.
- **Final**: one slot with the same shape.

## End-to-end flow

### 1) Seed UI with a snapshot (HTTP)
- **How**: Frontend fetches `GET /tournaments-online` on page load.
- **Why**: Gives immediate data before the socket is ready or after refresh; avoids empty UI if WS connects a tick later.

### 2) Open WebSocket and subscribe (WS)
- **How**: `useWebSocket` provides `ws` and `isReady`. On `message`, the client handles:
  - `TOURNAMENTS_STATE`: replace local `tournaments` array.
  - `TOURNAMENT_MATCH_READY`: if current user is in the payload, navigate to `/loading?mode=2` to play.
- **Why**: Broadcasts keep all clients eventually consistent without polling.

### 3) Create tournament (WS)
- **How**: Send `{ type: "TOURNAMENT_CREATE", token }`.
- **Server**: `createTournamentRoom` seeds a room with creator as first participant, status `waiting`, `participants=[creator]`.
- **Why**: Creator doesn’t need a separate join step; room exists immediately for others to join.

### 4) Join tournament (WS)
- **How**: Send `{ type: "TOURNAMENT_JOIN", tournamentId, token }`.
- **Server**: Adds user if not present. When `participants.length === 4`, marks `full`, builds semifinals via `buildSemifinals`, seeds empty final slot, sets status `semifinals`, and broadcasts.
- **Why**: Auto-locks at 4 to keep the bracket stable. Auto-generates slots to avoid client-side bracket math.

### 5) Leave tournament (WS)
- **How**: Send `{ type: "TOURNAMENT_LEAVE", tournamentId, token }` (only before it’s full/locked).
- **Server**: Removes participant, resets bracket if unlocked; deletes empty tournaments; broadcasts.
- **Why**: Prevents abandoned rooms and keeps the list tidy.

### 6) Mark ready (WS)
- **How**: Send `{ type: "TOURNAMENT_READY", tournamentId, matchId, token }` from semifinal or final buttons.
- **Server**:
  - Marks `ready` and `readyAt` for that player on the match slot.
  - When both players ready: ensures/creates VIP match row, hydrates `GameState`, sets `gameStatus="PLAYING"`, stores in `matches`, notifies both players via `TOURNAMENT_MATCH_READY`, sends live game state.
- **Why**: Prevents auto-start until both confirm presence; ready timestamps support no-show handling.

### 7) Report missing opponent (WS)
- **How**: Send `{ type: "TOURNAMENT_REPORT_MISSING", tournamentId, matchId, token }` after you’re ready.
- **Server**:
  - If reporter has been ready ≥1 minute and opponent not ready: promotes reporter, eliminates opponent. If semifinal, fills final slot; if final, crowns winner. Broadcasts state.
  - Special-case: solo finalist for ≥3 minutes since creation can be auto-crowned.
- **Why**: Avoids deadlocks when opponents never ready-up.

### 8) Match completion → advance bracket (server-driven)
- **Trigger**: Game tick loop calls `updateTournamentAfterMatch(gameState)` when a VIP match finishes.
- **Server**:
  - Semifinal: sets `winner`, eliminates loser, fills next free final slot, resets final ready state, sets status `finals` when both finalists known, broadcasts, and nudges finalists with a waiting payload.
  - Final: sets champion, status `completed`, eliminates loser, broadcasts.
- **Why**: Advancement is authoritative from gameplay results, not the client.

### 9) Broadcasts and refreshes
- **Broadcasts**: `broadcastTournamentState()` emits `{ type: "TOURNAMENTS_STATE", tournaments }` after any mutation.
- **Client refresh hook**: After each action (create/join/leave/ready/report), the frontend also asks `{ type: "REQUEST_TOURNAMENTS" }` to pull a fresh snapshot over WS.
- **Why**: Redundant pull keeps UI fresh even if a broadcast is missed.

## Client responsibilities
- Maintain `isSubmitting` to disable buttons during an in-flight action (prevents double-click spam).
- Track `myTournamentId` to gate actions (only join one tournament; leave only if inside).
- Navigate to `/loading?mode=2` on `TOURNAMENT_MATCH_READY` when you’re a participant.

## Server responsibilities
- Keep authoritative tournament state in memory; rebuild brackets when 4 players join.
- Guard joins at 4 players; never unlock once full (even after eliminations).
- Create/ensure VIP matches for bracket slots; wire them into the shared game loop.
- Handle readiness, no-show reports, and match completion to advance the bracket.
- Broadcast snapshots after every change.

## How to extend safely
- **Persist tournaments**: add DB writes in `createTournamentRoom`, `joinTournamentRoom`, `updateTournamentAfterMatch`, and restore on boot.
- **Per-action rate limits**: add debounce/throttle server-side per user and tournament to harden against spam.
- **More players / different formats**: generalize `buildSemifinals` and the state machine; ensure promotion logic and ready/report rules scale accordingly.
- **Spectator view**: expose read-only state via HTTP/WS without requiring auth.

## Quick reference of WS actions
- `TOURNAMENT_CREATE`
- `TOURNAMENT_JOIN` (tournamentId)
- `TOURNAMENT_LEAVE` (tournamentId)
- `TOURNAMENT_READY` (tournamentId, matchId)
- `TOURNAMENT_REPORT_MISSING` (tournamentId, matchId)
- `REQUEST_TOURNAMENTS`

## Why this design
- **WebSocket-first**: real-time sync, minimal client polling, and reuse of existing game socket.
- **In-memory state**: fastest iteration; acceptable for ephemeral brackets. Can be persisted later.
- **Ready + no-show handling**: reduces stuck brackets and user frustration.
- **Authoritative server advancement**: prevents client spoofing of winners.
- **Redundant refresh hook**: guards against missed broadcasts on flaky networks.
