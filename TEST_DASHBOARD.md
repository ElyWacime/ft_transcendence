# Test Dashboard User Creation

## Steps to Test

1. **Make sure you're logged in:**
   - Go to: `http://10.30.239.32:8080/login`
   - Log in with your credentials
   - Check browser console (F12) to verify token exists:
     ```javascript
     localStorage.getItem("token")
     ```

2. **Access the dashboard:**
   - Go to: `http://10.30.239.32:8080/dashboard`
   - Open browser console (F12) to see logs

3. **Check backend logs:**
   ```bash
   docker logs trans-pong-server-1 --tail 50
   ```
   
   Look for:
   - "User not found in database, attempting to create from JWT token"
   - "JWT decoded successfully"
   - "Creating user with data"
   - "User created successfully"

4. **Check if user was created:**
   ```bash
   docker exec trans-pong-server-1 sqlite3 /app/database.sqlite "SELECT id, email, User_name FROM Users;"
   ```

## Expected Behavior

When you access `/dashboard`:
1. Frontend extracts user ID from JWT token
2. Frontend sends request with Authorization header
3. Backend checks if user exists
4. If not, backend creates user from JWT token data
5. Dashboard displays user information

## Troubleshooting

### If user still not created:

1. **Check if JWT token is being sent:**
   - Open browser Network tab (F12 → Network)
   - Find the request to `/api/dashboard/:id`
   - Check Request Headers → Authorization
   - Should have: `Bearer <token>`

2. **Check backend logs for errors:**
   ```bash
   docker logs trans-pong-server-1 --tail 100 | grep -i "error\|jwt\|user\|create"
   ```

3. **Verify JWT token format:**
   - In browser console:
     ```javascript
     const token = localStorage.getItem("token");
     const decoded = JSON.parse(atob(token.split('.')[1]));
     console.log("User ID:", decoded.id);
     console.log("Email:", decoded.email);
     console.log("Name:", decoded.name);
     ```

4. **Test endpoint directly:**
   ```bash
   # Get your token first, then:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://10.30.239.32:3000/api/dashboard/YOUR_USER_ID
   ```

