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

### requirements
OS: linux / mac os
Docker (for arch linux `sudo pacman -S docker`)
GNU make (for arch linux run `sudo pacman -S make`)

## How to run
  # Linux
    Add sudo to Makfile for each command in flcean target in Makefile
    Run make
  # Mac os
    Run make

