# Dashboard Troubleshooting Guide

## ✅ What I Just Fixed

1. ✅ Added dashboard route to `frontend/src/App.tsx`
2. ✅ Registered dashboard routes in backend `services/fgame/index.js`
3. ✅ Added CORS support for the dashboard endpoint

## 🚀 How to Test

### Step 1: Restart Your Servers

**Backend (Fastify):**
```bash
cd services/fgame
npm start
# or if using docker
docker-compose restart pong-server
```

**Frontend:**
```bash
cd frontend
npm run dev
# or if using docker
docker-compose restart frontend
```

### Step 2: Test the Dashboard

**Option A: With User ID (No Login Required)**
```
http://localhost:8080/dashboard/YOUR_USER_ID
```

**Option B: Without ID (Requires Login)**
1. First, log in at: `http://localhost:8080/login`
2. Then go to: `http://localhost:8080/dashboard`

## 🔍 How to Get Your User ID

### Method 1: Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Run:
```javascript
const token = localStorage.getItem("token");
if (token) {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  console.log("User ID:", decoded.id);
}
```

### Method 2: Check Database
```bash
sqlite3 database.sqlite "SELECT id, email, User_name FROM Users LIMIT 5;"
```

### Method 3: Use the Helper HTML
Open `get_user_id.html` in your browser and click the button.

## 🐛 Common Issues

### Issue 1: "404 Not Found" or Blank Page

**Check:**
- ✅ Is the frontend server running? (usually port 8080)
- ✅ Did you restart the frontend after adding the route?
- ✅ Check browser console for errors (F12 → Console)

**Solution:**
```bash
# Restart frontend
cd frontend
npm run dev
```

### Issue 2: "Failed to fetch dashboard" Error

**Check:**
- ✅ Is the backend server running? (port 3000)
- ✅ Did you restart the backend after registering routes?
- ✅ Check browser Network tab (F12 → Network) for failed requests

**Solution:**
```bash
# Restart backend
cd services/fgame
npm start
```

### Issue 3: CORS Error

**Check:**
- ✅ Is CORS registered in backend? (should see "Dashboard routes registered!" in console)
- ✅ Check backend console for errors

**Solution:**
Make sure `cors` is imported and registered in `index.js`:
```javascript
import cors from "@fastify/cors";
await fastify.register(cors, { origin: true, credentials: true });
```

### Issue 4: "User not found" Error

**Check:**
- ✅ Does the user ID exist in the database?
- ✅ Is the ID correct? (check for typos)

**Solution:**
```bash
# Check if user exists
sqlite3 database.sqlite "SELECT * FROM Users WHERE id = 'YOUR_ID';"
```

### Issue 5: "Unable to get user ID" Error

**Check:**
- ✅ Are you logged in? (check localStorage for token)
- ✅ Is the JWT token valid?

**Solution:**
- Log in first, or use the URL with ID: `/dashboard/YOUR_ID`

## 🧪 Test Backend Endpoint Directly

Test if the backend endpoint works:

```bash
# Replace YOUR_USER_ID with actual user ID
curl http://localhost:3000/api/dashboard/YOUR_USER_ID
```

Expected response:
```json
{
  "user": { ... },
  "statistics": { ... },
  "lastMatch": { ... }
}
```

If this works but frontend doesn't, it's a frontend/CORS issue.

## 📋 Checklist

Before testing, make sure:

- [ ] Backend server is running (port 3000)
- [ ] Frontend server is running (port 8080)
- [ ] Both servers were restarted after changes
- [ ] You have a valid user ID (or are logged in)
- [ ] Database has user data
- [ ] No errors in browser console (F12)
- [ ] No errors in backend console

## 🔗 Correct URLs

- Frontend: `http://localhost:8080/dashboard` or `http://localhost:8080/dashboard/:id`
- Backend API: `http://localhost:3000/api/dashboard/:id`

## 💡 Still Not Working?

1. **Check browser console** (F12 → Console) for JavaScript errors
2. **Check Network tab** (F12 → Network) to see if API calls are being made
3. **Check backend console** for server errors
4. **Verify routes are registered:**
   - Backend should print: "Dashboard routes registered!"
   - Frontend should not show 404 in Network tab

## 📞 Quick Test Commands

```bash
# Test backend endpoint
curl http://localhost:3000/api/dashboard/test-id

# Check if frontend is running
curl http://localhost:8080

# Check if backend is running
curl http://localhost:3000
```

