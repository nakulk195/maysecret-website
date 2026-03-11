# MaySecret E-commerce Setup Guide

## Fixing User Registration Issues

The registration is failing because the backend needs to be properly set up. Follow these steps to fix it:

### 1. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and tables
CREATE DATABASE maysecret;
USE maysecret;

# Run the database schema (copy and paste the contents of backend/database.sql)
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new query tab
4. Copy and paste the contents of `backend/database.sql`
5. Execute the script

### 2. Environment Configuration

Create a `.env` file in the `backend` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=maysecret-super-secret-jwt-key-2024

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maysecret
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

**Note**: Replace `your_mysql_password_here` with your actual MySQL root password.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Start the Backend Server

```bash
# Development mode (recommended for testing)
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
Server running on port 5000
MySQL database connection established successfully.
Database models synchronized
```

### 5. Test the Backend

Open a new terminal and test if the server is running:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"Server is running"}
```

### 6. Test Registration Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "addresses": []
  }
}
```

## Troubleshooting Common Issues

### Issue 1: "Cannot connect to server"
**Cause**: Backend server is not running
**Solution**: Start the backend with `npm run dev`

### Issue 2: "MySQL database connection failed"
**Cause**: MySQL server is not running or credentials are wrong
**Solution**: 
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database `maysecret` exists

### Issue 3: "Table doesn't exist"
**Cause**: Database schema not created
**Solution**: Run the `database.sql` script

### Issue 4: "JWT_SECRET is missing"
**Cause**: Environment variable not set
**Solution**: Create `.env` file with JWT_SECRET

### Issue 5: "Port 5000 already in use"
**Cause**: Another service is using port 5000
**Solution**: Change PORT in `.env` to another port (e.g., 5001)

## Frontend Testing

After backend is running:

1. **Open your React app** in another terminal:
   ```bash
   npm start
   ```

2. **Navigate to Login page** (`/login`)

3. **Switch to Registration mode** (click "Don't have an account? Sign up")

4. **Fill in the form**:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123

5. **Click "Create Account"**

6. **Expected Result**: 
   - Success message: "Registration successful! Redirecting..."
   - Automatic redirect to homepage after 1.5 seconds

## Database Verification

To verify the user was created:

```bash
mysql -u root -p maysecret

# Check users table
SELECT id, name, email, created_at FROM users;

# Check if password was hashed (should be a long string)
SELECT id, name, email, LEFT(password, 20) as password_preview FROM users;
```

## Security Notes

- **JWT_SECRET**: Use a strong, random string in production
- **Database Password**: Use a dedicated MySQL user, not root
- **HTTPS**: Enable HTTPS in production
- **Password Policy**: Consider adding password strength requirements

## Next Steps

After successful registration:

1. **Test Login** with the created account
2. **Test Address Management** (add/edit addresses)
3. **Test Shopping Cart** functionality
4. **Test Checkout** process

## Support

If you still encounter issues:

1. Check browser console for errors
2. Check backend terminal for error logs
3. Verify database connection
4. Ensure all environment variables are set
5. Check if MySQL service is running

The registration should work once the backend is properly configured and running!
