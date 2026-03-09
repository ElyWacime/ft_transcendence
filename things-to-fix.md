# 🔧 Things to Fix — ft_transcendence

---

## 🔴 Critical Bugs

- [ ] **OAuth uses wrong JWT secret for refresh token** — OAuth route signs refresh token with `JWT_ACCESS_SECRET` instead of `JWT_REFRESH_SECRET`
- [ ] **OAuth payload field mismatch** — OAuth signs `{ id, email, name }` but login signs `{ id, email, username }`. Causes `req.user.username` to be `undefined` for OAuth users
- [ ] **OAuth passes access token in URL query params** — Token leaks via browser history, server logs, referrer headers. Use httpOnly cookie instead
- [ ] **Logout endpoint has no authentication** — Anyone can log out any user by sending their email
- [ ] **`validate_token` doesn't handle missing user** — If user is deleted but token is valid, it throws
- [ ] **Chat `server.js` has a syntax error** — Stray `}-` after a GET endpoint
- [ ] **`/chat/sync-user` has no authentication** — Anyone can insert users into chat DB
- [ ] **Matchmaking race condition** — Find-room + update-room is not atomic, two players can overwrite each other
- [ ] **Tournament state is in-memory only** — Server restart wipes all active tournaments;
- [ ] **Game service user ID type mismatch** — SQL schema uses `INTEGER` but auth generates `CUID` strings
- [ ] **React hooks violation** — `GameOnline.tsx` and `TournamentOnline.tsx` call `useEffect` inside conditional returns
- [ ] **PongCanvas renders stale state** — `requestAnimationFrame` loop captures old `gameState` from closure
- [ ] **Duplicate `addEventListener` calls** — Same listeners registered twice in PongCanvas components

---

## 🟡 Security Issues

- [ ] **Hardcoded secrets in env files** — `JWT_SECRET`, OAuth client secret in plaintext in `services/env`
- [ ] **`NODE_TLS_REJECT_UNAUTHORIZED=0`** — Disables all cert verification for chat & game services
- [ ] **No rate limiting** on login/register endpoints
- [ ] **No input validation on WebSocket messages** — Malformed messages could crash game service
- [ ] **No message length validation** in chat service
- [ ] **`console.log` leaking tokens/user data** — In AuthContext, WebSocketContext, tokenRefresh
- [ ] **No CSRF protection** across all services
- [ ] **No CSP headers** in Nginx gateway config
- [ ] **No password complexity requirements** beyond 6-char minimum

---

## ❌ Missing Features (to reach 7 Major Modules)

- [ ] **Implement 2FA (Two-Factor Authentication)** — JWT is done but 2FA is completely missing:
  - [ ] TOTP setup endpoint (generate QR code for authenticator apps)
  - [ ] TOTP verification on login
  - [ ] 2FA enable/disable toggle in user settings UI
  - [ ] Backup codes generation
- [ ] **Friend online status** — Not properly displayed on user profiles
- [ ] **Other users' profiles** — Dashboard only shows your own stats, not other users' win/loss stats

---

## 🟠 Code Quality

- [ ] **Remove all `console.log` debug statements** from production code
- [ ] **Fix duplicate interface declarations** in auth service types
- [ ] **Fix inconsistent variable naming** in game service (typos in function names)
- [ ] **Remove unused files** — `index.js` in game-service is empty, old `.old.tsx` files in frontend
- [ ] **Add pagination** to chat messages and conversations
- [ ] **AI difficulty selector** — AI opponent defaults to HARD, no UI to choose difficulty
- [ ] **Canvas is fixed 800×600** — Not responsive on different screen sizes

---

## 🐳 DevOps / Infrastructure

- [ ] **Add health checks** to docker-compose services
- [ ] **Uncomment `restart: always`** for gateway and game-server
- [ ] **Frontend Docker uses dev mode** — Volume mounts source code, not production build
- [ ] **No `depends_on`** defined between services for proper startup order
- [ ] **Duplicated `JWT_ACCESS_SECRET`** in multiple env locations — risk of mismatch

---

## 📊 Module Count Summary

| #  | Module                        | Type  | Status                                |
| -- | ----------------------------- | ----- | ------------------------------------- |
| 1  | Backend Framework (Fastify)   | Major | ✅ Done                               |
| 2  | Frontend Toolkit (TypeScript) | Minor | ✅ Done                               |
| 3  | Database (SQLite)             | Minor | ✅ Done                               |
| 4  | Standard User Management      | Major | ✅ Done (fix bugs)                    |
| 5  | Remote Auth (GitHub OAuth)    | Major | ✅ Done (fix bugs)                    |
| 6  | Remote Players                | Major | ✅ Done                               |
| 7  | AI Opponent                   | Major | ✅ Done                               |
| 8  | Stats Dashboards              | Minor | ✅ Done                               |
| 9  | Live Chat                     | Major | ✅ Done (fix bugs)                    |
| 10 | 2FA & JWT                     | Major | ⚠️ JWT only —**2FA missing** |
| 11 | Microservices Backend         | Major | ✅ Done                               |

**Current total**: ~6.5 Major equivalent → **Need 2FA to reach 7**
