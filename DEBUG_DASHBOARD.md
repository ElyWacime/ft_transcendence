# Debug Dashboard "Not Found" Error

## Issue
When accessing `10.30.239.32/dashboard`, you get "Failed to fetch dashboard: Not Found"

## Possible Causes

### 1. User Not Logged In
- If you access `/dashboard` without an ID, the app tries to extract user ID from JWT token
- **Solution**: Log in first at `http://10.30.239.32:8080/login`

### 2. User ID Doesn't Exist in Database
- The JWT token contains a user ID, but that user doesn't exist in the database
- **Solution**: Check if user exists in database

### 3. Wrong User ID Format
- The user ID in the token might not match the format in the database
- **Solution**: Check the user ID format

## How to Debug

### Step 1: Check if you're logged in
1. Open browser console (F12)
2. Run:
```javascript
localStorage.getItem("token")
```
If it returns `null`, you're not logged in.

### Step 2: Get your User ID from token
1. Open browser console (F12)
2. Run:
```javascript
const token = localStorage.getItem("token");
if (token) {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  console.log("User ID:", decoded.id);
  console.log("Email:", decoded.email);
} else {
  console.log("Not logged in");
}
```

### Step 3: Check if user exists in database
```bash
docker exec trans-pong-server-1 sqlite3 /app/database.sqlite "SELECT id, email, User_name FROM Users WHERE id = 'YOUR_USER_ID';"
```

### Step 4: Test with direct URL
Try accessing the dashboard with a user ID directly:
```
http://10.30.239.32:8080/dashboard/YOUR_USER_ID
```

## Quick Fixes

### Option 1: Log in first
1. Go to: `http://10.30.239.32:8080/login`
2. Log in with your credentials
3. Then go to: `http://10.30.239.32:8080/dashboard`

### Option 2: Use user ID in URL
If you know a valid user ID:
```
http://10.30.239.32:8080/dashboard/YOUR_USER_ID
```

### Option 3: Create a test user
If no users exist, you need to create one first by:
1. Registering a new account, OR
2. Playing a game (which creates a user automatically)

## Check Browser Console
Open browser console (F12 → Console) and look for:
- "Fetching dashboard for user ID: ..." - shows what ID is being used
- "Dashboard API Error: ..." - shows the actual error
- Any CORS or network errors

