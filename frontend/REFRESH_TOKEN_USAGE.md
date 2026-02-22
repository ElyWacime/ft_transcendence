# Refresh Token Implementation - Usage Guide

## ✅ What's Been Implemented

### Backend (Auth Service)
- ✅ Refresh tokens stored in database
- ✅ Access token: 15 minutes expiry
- ✅ Refresh token: 7 days expiry
- ✅ Token rotation on refresh
- ✅ `/refresh` endpoint available
- ✅ Logout clears refresh tokens

### Frontend
- ✅ `AuthContext` stores both tokens
- ✅ Login page handles refresh tokens
- ✅ Token refresh utility created

## 🔄 How to Use Token Refresh

### Option 1: Manual API Calls with Auto-Refresh

Use the `fetchWithAuth` helper for automatic token refresh:

```typescript
import { fetchWithAuth } from "@/lib/tokenRefresh";

// Example: Protected API call
async function getProtectedData() {
  const response = await fetchWithAuth('/api/users/me', {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return await response.json();
}
```

The `fetchWithAuth` function will:
1. Add the access token to headers automatically
2. If it gets a 401 error, it will refresh the token
3. Retry the request with the new token
4. If refresh fails, redirect to login

### Option 2: Manual Token Refresh

```typescript
import { refreshToken } from "@/lib/tokenRefresh";

// Manually refresh token
const newTokens = await refreshToken();
if (newTokens) {
  console.log('Token refreshed successfully');
  // Tokens are automatically stored in localStorage
} else {
  console.log('Refresh failed, redirect to login');
}
```

### Option 3: Update Existing API Methods

Update your API methods in `api.ts` to use `fetchWithAuth`:

```typescript
// Before:
async me() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${this.baseUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

// After:
import { fetchWithAuth } from './tokenRefresh';

async me() {
  const res = await fetchWithAuth(`${this.baseUrl}/me`, {
    method: 'GET',
  });
  return await res.json();
}
```

## 🚀 Current Status

### ✅ Working Now:
- Login stores both tokens
- OAuth (GitHub) stores both tokens
- Logout clears both tokens
- Refresh endpoint ready on backend

### 🔧 To Implement (Optional):
- Replace `fetch` calls in `api.ts` with `fetchWithAuth` for automatic refresh
- Add token expiry checker to refresh proactively before expiry
- Add refresh token to WebSocket connections if needed

## 📝 Example: Update a Protected Route

```typescript
// In api.ts or any component
import { fetchWithAuth } from '@/lib/tokenRefresh';

async update_password(current_password: string, new_password: string) {
  const res = await fetchWithAuth(`${this.baseUrl}/update_password`, {
    method: "PUT",
    body: JSON.stringify({ current_password, new_password }),
    credentials: "include",
  });

  return await res.json();
}
```

That's it! The tokens will refresh automatically when needed.
