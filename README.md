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

### requirements
Docker (for arch linux `sudo pacman -S docker`)
GNU make (for arch linux run `sudo pacman -S make`)

## How to run
  # Linux
    Add sudo to Makfile for each command in flcean target in Makefile
    Run make
  # Mac os
    Run make

