# Dashboard Ayoub - Setup Instructions

This document explains how to set up and use the new dashboard functionality created with `_ayoub` suffix.

## Files Created

### Backend Files:

1. **`services/fgame/dashboard_ayoub.js`** - Dashboard route handler
2. **`services/fgame/setup_dashboard_ayoub.js`** - Setup function to register dashboard routes

### Frontend Files:

1. **`frontend/src/lib/api_ayoub.ts`** - API client for dashboard
2. **`frontend/src/pages/Dashboard_ayoub.tsx`** - Dashboard page component
3. **`frontend/src/routes_dashboard_ayoub.tsx`** - Route configuration export

## Backend Setup

### Step 1: Register Dashboard Routes in Fastify Server

In your `services/fgame/index.js` file, add the following import and registration:

```javascript
import { setupDashboard_ayoub } from "./setup_dashboard_ayoub.js";

// After dbcnx.connect() and before fastify.listen()
await setupDashboard_ayoub(fastify, dbcnx);
```

Or if you prefer to register manually:

```javascript
import cors from "@fastify/cors";
import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";

// Register CORS (if not already registered)
await fastify.register(cors, {
  origin: true,
  credentials: true
});

// Register dashboard routes
await registerDashboardRoutes_ayoub(fastify, dbcnx);
```

### Step 2: Verify the Endpoint

The dashboard endpoint will be available at:

```
GET http://10.30.239.32:3000/api/dashboard/:id
```

Where `:id` is the user ID.

## Frontend Setup

### Step 1: Add Route to App.tsx

In your `frontend/src/App.tsx` file, add:

```tsx
import Dashboard_ayoub from "./pages/Dashboard_ayoub";

// Inside the <Routes> component, add:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute children={undefined}>
      <Dashboard_ayoub />
    </ProtectedRoute>
  }
/>
```

### Step 2: (Optional) Add Navigation Link

In your navigation component, you can add a link to the dashboard:

```tsx
{ path: "/dashboard", label: "Dashboard", icon: BarChart }
```

## Usage

1. **Access the Dashboard**: Navigate to `/dashboard` in your application
2. **Authentication**: The dashboard requires the user to be logged in (uses ProtectedRoute)
3. **Data Display**: The dashboard shows:
   - User profile information (name, email, avatar, online status)
   - Statistics (total matches, wins, losses, win rate, tournament participations)
   - Last match information

## API Endpoint Details

### GET `/api/dashboard/:id`

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "User_name": "Player Name",
    "avatar": "https://...",
    "isOnline": true,
    "Auto_Match": true,
    "CreatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statistics": {
    "totalMatches": 10,
    "totalWins": 7,
    "totalLosses": 3,
    "winRate": 70.0,
    "tournamentParticipations": 2
  },
  "lastMatch": {
    "id": 1,
    "P1_Id": "player1_id",
    "P2_Id": "player2_id",
    "score1": 5,
    "score2": 3,
    "gameStatus": "FINISHED",
    "Winner_Id": "player1_id",
    "player1Name": "Player 1",
    "player2Name": "Player 2"
  }
}
```

## Functions Used from DBController.js

The dashboard uses the following functions from `DBController.js`:

- `getUserById(id)` - Get user information
- `UserCountWins_ayoub(id)` - Get total wins
- `UserCountTournParticipation_ayoub(id)` - Get tournament participations
- `getLasttMatchByPlayerID_ayoub(id)` - Get last match information
- Direct SQL query for total matches count

## Notes

- All files are created with `_ayoub` suffix as requested
- No existing files were modified
- The dashboard automatically extracts user ID from JWT token stored in localStorage
- CORS is handled in the setup function
- The dashboard is protected and requires authentication
