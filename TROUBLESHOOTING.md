# MaySecret Network Error Troubleshooting Guide

## 🚨 Common "Network Error" Issues and Solutions

### Issue 1: "Unable to connect to server. Please check if backend is running."

**Symptoms:**
- Frontend shows network error when trying to register/login
- Console shows `ERR_NETWORK` error
- Backend server is not responding

**Solutions:**

#### A. Start the Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 MaySecret Backend Server Started
📍 Server running on port 5000
🌍 Environment: development
🔗 Health check: http://localhost:5000/api/health
📱 Frontend should connect to: http://localhost:5000
```

#### B. Check if Port 5000 is Available
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**If port is in use:**
1. Kill the process using the port
2. Or change PORT in `.env` file to another port (e.g., 5001)
3. Update frontend API_BASE_URL accordingly

#### C. Verify Backend Health
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "port": 5000,
  "environment": "development"
}
```

### Issue 2: Database Connection Failed

**Symptoms:**
- Backend starts but shows database connection error
- Registration fails with server error
- Console shows "Database sync error"

**Solutions:**

#### A. Check MySQL Service
```bash
# Windows
services.msc
# Look for "MySQL" service and ensure it's running

# Mac
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

#### B. Verify Database Exists
```bash
mysql -u root -p
SHOW DATABASES;
```

**If `maysecret` database doesn't exist:**
```sql
CREATE DATABASE maysecret;
USE maysecret;
-- Run the contents of backend/database.sql
```

#### C. Check .env Configuration
Ensure `backend/.env` has correct database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maysecret
DB_USER=root
DB_PASSWORD=your_actual_password
```

### Issue 3: CORS Errors

**Symptoms:**
- Browser console shows CORS policy errors
- Frontend can't communicate with backend
- Preflight requests fail

**Solutions:**

#### A. Verify CORS Configuration
Backend should have:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // React dev server
    'http://localhost:3001'  // Alternative React port
  ],
  credentials: true
}));
```

#### B. Check Frontend Origin
Ensure your React app is running on one of the allowed origins:
- `http://localhost:3000` (default)
- `http://localhost:3001` (if port 3000 is busy)

### Issue 4: JWT Secret Missing

**Symptoms:**
- Backend starts but shows "JWT_SECRET: ❌ Missing"
- Authentication endpoints return 500 errors
- Token generation fails

**Solutions:**

#### A. Set JWT_SECRET in .env
```env
JWT_SECRET=maysecret-super-secret-jwt-key-2024-change-this-in-production
```

#### B. Use Setup Script
```bash
cd backend
npm run setup
```

### Issue 5: Frontend API Configuration

**Symptoms:**
- Frontend tries to connect to wrong URL
- API calls fail with wrong base URL
- Environment-specific issues

**Solutions:**

#### A. Check API Base URL
Frontend should use:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://yourdomain.com/api'
  : 'http://localhost:5000/api';
```

#### B. Verify Environment Variables
Create `.env` in frontend root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔧 Quick Fix Checklist

### Backend Setup
- [ ] Run `npm run setup` to create .env file
- [ ] Edit .env with your MySQL password
- [ ] Create MySQL database: `maysecret`
- [ ] Run database schema: `mysql -u root -p maysecret < database.sql`
- [ ] Start server: `npm run dev`
- [ ] Test health: `curl http://localhost:5000/api/health`

### Frontend Setup
- [ ] Ensure React app runs on port 3000
- [ ] Check API base URL in `src/services/api.js`
- [ ] Verify CORS allows localhost:3000
- [ ] Test registration with test user

### Database Setup
- [ ] MySQL service is running
- [ ] Database `maysecret` exists
- [ ] Tables are created (users, addresses, etc.)
- [ ] User has proper permissions

## 🧪 Testing Steps

### 1. Test Backend Connection
```bash
cd backend
npm run test-connection
```

### 2. Test Frontend Registration
1. Open React app in browser
2. Navigate to `/login`
3. Switch to registration mode
4. Fill form with test data
5. Click "Create Account"
6. Check for success message

### 3. Verify Database Entry
```bash
mysql -u root -p maysecret
SELECT * FROM users;
```

## 📱 Common Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Unable to connect to server" | Backend not running | Start with `npm run dev` |
| "Database connection failed" | MySQL not running/configured | Check MySQL service and .env |
| "JWT_SECRET missing" | Environment variable not set | Add JWT_SECRET to .env |
| "Port already in use" | Another service using port 5000 | Kill process or change port |
| "CORS policy blocked" | Frontend origin not allowed | Check CORS configuration |
| "Table doesn't exist" | Database schema not created | Run database.sql script |

## 🆘 Still Having Issues?

### Check Logs
1. **Backend Console:** Look for error messages and stack traces
2. **Browser Console:** Check for JavaScript errors and network failures
3. **Network Tab:** Verify API requests are being made to correct URLs

### Debug Mode
Enable detailed logging:
```javascript
// In backend/server.js
console.log('🔍 Request details:', {
  method: req.method,
  url: req.url,
  headers: req.headers,
  body: req.body
});
```

### Common Commands
```bash
# Kill process on port 5000
Windows: netstat -ano | findstr :5000
Mac/Linux: lsof -ti:5000 | xargs kill -9

# Check MySQL status
mysql -u root -p -e "SELECT VERSION();"

# Test database connection
mysql -u root -p maysecret -e "SHOW TABLES;"

# Restart services
# Windows: Restart MySQL service
# Mac: brew services restart mysql
# Linux: sudo systemctl restart mysql
```

## 🎯 Success Indicators

When everything is working correctly, you should see:

1. **Backend Console:**
   ```
   🚀 MaySecret Backend Server Started
   📍 Server running on port 5000
   ✅ Database models synchronized successfully
   ```

2. **Frontend Console:**
   ```
   🔗 API Base URL: http://localhost:5000/api
   🚀 API Request: POST /auth/register
   ✅ API Response: 201 /auth/register
   ```

3. **Registration Success:**
   - Success message: "Registration successful! Redirecting..."
   - Automatic redirect to homepage
   - User data stored in localStorage

## 🚀 Next Steps After Fix

1. **Test Login** with created account
2. **Add Addresses** to test full functionality
3. **Test Shopping Cart** and checkout
4. **Deploy to Production** with proper environment variables

---

**Need more help?** Check the console logs, error messages, and ensure all services are running properly. The enhanced error handling should now provide clear guidance on what needs to be fixed!
