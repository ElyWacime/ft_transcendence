# Tournament API (fgame)

This microservice implements single-elimination tournaments on top of existing 1vs1 game logic.

## REST Endpoints

- POST /api/tournaments
  - Body: { "label": "My Cup", "maxPlayers": 8 }
  - Response: { id }

- POST /api/tournaments/:id/join
  - Body: { "userId": "<uuid>" } or with Authorization: Bearer <JWT>
  - Adds the player to participation list.

- POST /api/tournaments/:id/start
  - Seeds Round 1, creates `Match` rows with `T_Id` and `round = 1`.
  - Byes auto-advance to the next round.

- GET /api/tournaments/:id
  - Returns tournament, participants, and all matches.

## WebSocket Integration

When clients connect with `type = "REGISTER"` and include `tournamentId`, the server will place them into the first open `Match` for that tournament:

```json
{
  "type": "REGISTER",
  "mode": 2,
  "token": "<jwt>",
  "tournamentId": 12
}
```

Once both players are present (`count_players == 2`), the match begins using the existing 1vs1 logic. On `FINISHED` events, the tournament advances rounds automatically until a champion is declared.

## Schema Notes

- `Match.round` tracks bracket rounds. A runtime migration adds this column if missing.
- `Match.T_Id` links matches to tournaments.
- Indexes on `(T_Id)` and `(T_Id, round)` accelerate bracket queries.

