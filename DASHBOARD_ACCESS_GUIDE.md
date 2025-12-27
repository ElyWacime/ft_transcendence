# Dashboard Access Guide

## How to Access the Dashboard

The dashboard can be accessed in two ways:

### Option 1: With User ID in URL (No Login Required)
```
http://10.30.239.32:8080/dashboard/:id
```

**Example:**
```
http://10.30.239.32:8080/dashboard/user123
```

**Where to get the ID:**
- The user ID is typically the same as the email or a unique identifier
- You can find it in the JWT token (see below)
- Or check your database `Users` table

### Option 2: Without ID (Requires Login)
```
http://10.30.239.32:8080/dashboard
```

This will automatically extract the user ID from your JWT token stored in localStorage.

## How to Get the User ID

### Method 1: From JWT Token (Browser Console)
1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Run this JavaScript code:

```javascript
// Decode JWT token to get user ID
const token = localStorage.getItem("token");
if (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const decoded = JSON.parse(jsonPayload);
  console.log("User ID:", decoded.id);
  console.log("Email:", decoded.email);
  console.log("Full token data:", decoded);
}
```

### Method 2: From Database
Check your SQLite database:
```sql
SELECT id, email, User_name FROM Users;
```

### Method 3: From Backend Logs
When a user connects via WebSocket, the server logs the ID:
```
console.log(id, email, name);
```

## Route Configuration

Add this route to your `App.tsx`:

```tsx
import Dashboard_ayoub from "./pages/Dashboard_ayoub";

// In your Routes component:
<Route
  path="/dashboard/:id?"
  element={
    <ProtectedRoute children={undefined}>
      <Dashboard_ayoub />
    </ProtectedRoute>
  }
/>
```

The `:id?` makes the ID parameter optional:
- `/dashboard` - Uses ID from JWT token (requires login)
- `/dashboard/user123` - Uses the provided ID (no login required)

## Backend Endpoint

The backend endpoint is:
```
GET http://10.30.239.32:3000/api/dashboard/:id
```

**Example:**
```
GET http://10.30.239.32:3000/api/dashboard/user123
```

## Testing

1. **Test with ID in URL:**
   ```
   http://10.30.239.32:8080/dashboard/your-user-id-here
   ```

2. **Test without ID (requires login):**
   - First, log in to your application
   - Then navigate to: `http://10.30.239.32:8080/dashboard`
   - The dashboard will automatically use your logged-in user ID

## Troubleshooting

### "Unable to get user ID" Error
- If accessing `/dashboard` without ID: Make sure you're logged in
- If accessing `/dashboard/:id`: Make sure the ID exists in the database

### "User not found" Error
- The user ID doesn't exist in the database
- Check the `Users` table in your SQLite database

### CORS Error
- Make sure CORS is registered in your Fastify server
- Use the `setup_dashboard_ayoub.js` file to register CORS



