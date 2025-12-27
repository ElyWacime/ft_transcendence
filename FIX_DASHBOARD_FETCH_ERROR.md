# Fix: "Failed to fetch" Dashboard Error

## ✅ What I Fixed

1. **Added gateway route** in `services/gateway/nginx.conf` to proxy dashboard API requests
2. **Updated API URL** in `frontend/src/lib/api_ayoub.ts` to use gateway instead of direct 10.30.239.32:3000

## 🔄 What You Need to Do

### Step 1: Restart Gateway (nginx)
```bash
docker-compose restart gateway
```

Or if running locally:
```bash
# Restart nginx or your gateway service
```

### Step 2: Restart Backend (pong-server)
```bash
docker-compose restart pong-server
```

### Step 3: Restart Frontend (if needed)
```bash
docker-compose restart frontend
```

Or if running locally:
```bash
cd frontend
npm run dev
```

## 🧪 Test the Fix

### Test 1: Check Gateway Route
```bash
# Should return dashboard data or 404 (if user doesn't exist)
curl http://10.30.239.32/api/dashboard/test-user-id
```

### Test 2: Check Backend Directly
```bash
# Should return dashboard data
curl http://10.30.239.32:3000/api/dashboard/test-user-id
```

### Test 3: Test in Browser
1. Open browser console (F12)
2. Go to Network tab
3. Navigate to: `http://10.30.239.32:8080/dashboard/YOUR_USER_ID`
4. Check if the request to `/api/dashboard/:id` succeeds

## 🔍 Debugging

### If Still Getting "Failed to fetch":

1. **Check Browser Console (F12 → Console)**
   - Look for CORS errors
   - Look for network errors

2. **Check Network Tab (F12 → Network)**
   - Find the request to `/api/dashboard/:id`
   - Check the status code
   - Check the response

3. **Check Gateway Logs**
   ```bash
   docker-compose logs gateway
   ```

4. **Check Backend Logs**
   ```bash
   docker-compose logs pong-server
   ```

5. **Verify Gateway Route**
   - Check `services/gateway/nginx.conf` has the dashboard route
   - Should see: `location /api/dashboard/`

6. **Verify Backend Route**
   - Check backend console for: "Dashboard routes registered!"
   - Test: `curl http://10.30.239.32:3000/api/dashboard/test-id`

## 📋 Common Issues

### Issue: CORS Error
**Solution:** Gateway should handle CORS. Make sure gateway is restarted.

### Issue: 502 Bad Gateway
**Solution:** Backend (pong-server) might not be running. Check:
```bash
docker-compose ps
docker-compose logs pong-server
```

### Issue: 404 Not Found
**Solution:** 
- Check if user ID exists in database
- Check if backend route is registered
- Check gateway nginx.conf has the route

### Issue: Connection Refused
**Solution:** 
- Backend not running on port 3000
- Gateway can't reach pong-server container
- Check Docker network: `docker network inspect transcendence`

## 🎯 Expected Behavior

After fix:
- ✅ Frontend calls: `/api/dashboard/:id`
- ✅ Gateway proxies to: `http://pong-server:3000/api/dashboard/:id`
- ✅ Backend returns dashboard data
- ✅ No CORS errors
- ✅ Dashboard page loads successfully

## 📝 Files Changed

1. `services/gateway/nginx.conf` - Added dashboard API route
2. `frontend/src/lib/api_ayoub.ts` - Updated to use gateway URL

