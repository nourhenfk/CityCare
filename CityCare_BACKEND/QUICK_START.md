# 🚀 Quick Start Guide - CityCare Backend

## What You Have

A complete, production-ready Node.js backend for your CityCare urban problem reporting application with:

✅ **User Authentication** - JWT-based auth with roles (User, Admin)  
✅ **Report Management** - Full CRUD operations for urban problem reports  
✅ **Image Upload** - Cloudinary integration for photo storage  
✅ **Geolocation** - Store and query location data  
✅ **Role-Based Access** - Different permissions for citizens and administrators  
✅ **Push Notifications** - System ready for mobile notifications  
✅ **Well-Documented** - Extensive comments and API documentation  

## File Structure Overview

```
CityCare_BACKEND/
├── 📁 config/                    # Configuration files
│   ├── database.js              # MongoDB connection
│   └── cloudinary.js            # Cloudinary setup
│
├── 📁 controllers/               # Business logic
│   ├── authController.js        # Auth operations (login, register)
│   ├── reportController.js      # Report CRUD operations
│   └── userController.js        # User management (admin)
│
├── 📁 middleware/                # Express middleware
│   ├── auth.js                  # JWT verification & authorization
│   ├── error.js                 # Error handling
│   └── upload.js                # File upload handling (Multer)
│
├── 📁 models/                    # MongoDB schemas
│   ├── User.js                  # User model with password hashing
│   └── Report.js                # Report model with location & status
│
├── 📁 routes/                    # API endpoints
│   ├── authRoutes.js            # /api/auth/*
│   ├── reportRoutes.js          # /api/reports/*
│   └── userRoutes.js            # /api/users/*
│
├── 📁 services/                  # Additional services
│   └── notificationService.js   # Push notification logic
│
├── 📁 utils/                     # Helper functions
│   ├── validators.js            # Input validation
│   └── responseHelper.js        # Response formatting
│
├── 📄 server.js                  # Main application entry point
├── 📄 package.json               # Dependencies & scripts
├── 📄 .env.example               # Environment variables template
├── 📄 .gitignore                 # Git ignore rules
│
└── 📚 Documentation/
    ├── README.md                 # Project overview
    ├── INSTALLATION.md           # Detailed setup instructions
    ├── API_DOCUMENTATION.md      # Complete API reference
    └── CityCare_API.postman_collection.json  # Postman collection
```

## 🎯 Next Steps (In Order)

### 1️⃣ Install Dependencies (5 minutes)
```powershell
npm install
```

### 2️⃣ Set Up Environment Variables (10 minutes)
```powershell
# Copy the example file
Copy-Item .env.example .env

# Edit .env and fill in:
# - MONGODB_URI (your MongoDB connection)
# - JWT_SECRET (any random secure string)
# - CLOUDINARY credentials (from cloudinary.com)
```

**Get Cloudinary credentials:**
1. Go to https://cloudinary.com/
2. Sign up for free
3. Dashboard → Copy: Cloud Name, API Key, API Secret
4. Paste into your `.env` file

### 3️⃣ Start MongoDB (2 minutes)
- **Local MongoDB:** Open a terminal and run `mongod`
- **MongoDB Atlas:** Use the connection string in `.env`

### 4️⃣ Start the Server (1 minute)
```powershell
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 CityCare Backend Server
Server running on port 5000
✅ MongoDB Connected
```

### 5️⃣ Test the API (10 minutes)

**Option A: Using Postman**
1. Import `CityCare_API.postman_collection.json`
2. Test "Register User" → Save the token
3. Update the `token` variable in Postman
4. Test other endpoints

**Option B: Using PowerShell**
```powershell
# Register a user
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    role = "ROLE_USER"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## 🔑 Key Features Explained

### Authentication System
- **Register**: Create new users with role assignment
- **Login**: Get JWT token for API access
- **Roles**: ROLE_USER (citizen), ROLE_ADMIN (administrator)

### Report Management
- **Citizens** can:
  - Create reports with photo + location
  - View their own reports
  - Add comments
  - Upvote reports
  
- **Admins** can:
  - View all reports
  - Update status (OUVERT → EN_COURS → RESOLU)
  - Assign priority
  - Add official comments
  
### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ CORS protection
- ✅ Error handling

## 📱 Connecting to Your Ionic Frontend

In your Ionic app, configure the API URL:

```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:5000/api'
};
```

Example API call:
```typescript
// Login example
async login(email: string, password: string) {
  const response = await fetch(`${environment.apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  const token = data.data.token;
  // Store token for future requests
}

// Create report with image
async createReport(reportData: FormData) {
  const token = // get stored token
  
  const response = await fetch(`${environment.apiUrl}/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: reportData // FormData with image
  });
  
  return await response.json();
}
```

## 🔧 Customization Points

### Add New Categories
Edit `models/Report.js`, line ~35:
```javascript
category: {
  enum: [
    'VOIRIE', 'ECLAIRAGE', 'PROPRETE', 
    'YOUR_NEW_CATEGORY',  // Add here
    'AUTRE'
  ]
}
```

### Add Push Notifications (FCM/Expo)
Edit `services/notificationService.js`:
```javascript
// Uncomment and configure your preferred service:
// - Firebase Cloud Messaging (FCM)
// - Expo Push Notifications
// - OneSignal
```

### Change File Size Limit
Edit `.env`:
```
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## 📚 Documentation Files

- **INSTALLATION.md** → Detailed setup instructions
- **API_DOCUMENTATION.md** → Complete API reference with examples
- **README.md** → Project overview and features
- **Postman Collection** → Ready-to-use API tests

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongooseError: The `uri` parameter to `openUri()` must be a string
```
**Fix:** Check your MONGODB_URI in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:** Change PORT in `.env` to another value (e.g., 3000)

### Cloudinary Upload Fails
**Fix:** 
1. Verify credentials in `.env`
2. Check image is under 5MB
3. Ensure Cloudinary account is active

### JWT Token Invalid
**Fix:**
- Include header: `Authorization: Bearer <token>`
- Ensure token is from a successful login
- Check JWT_SECRET is consistent

## 💡 Tips

1. **Use Postman** for testing - it's much easier than curl/PowerShell for file uploads
2. **Check logs** - The server prints helpful debug info in development mode
3. **MongoDB Compass** - Great GUI for viewing your database
4. **Read comments** - The code is heavily commented to help you understand

## 🎓 Learning Resources

If you're new to Node.js/Express:
- Express.js Docs: https://expressjs.com/
- MongoDB University: https://university.mongodb.com/
- JWT Introduction: https://jwt.io/introduction

## ✅ Pre-Production Checklist

Before deploying to production:
- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Review CORS_ORIGIN settings
- [ ] Set up proper MongoDB Atlas security
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Set up monitoring/logging
- [ ] Create database backups
- [ ] Test all endpoints thoroughly

## 🎉 You're Ready!

Everything is set up and ready to use. Start with the INSTALLATION.md file for step-by-step setup, then test the API with the Postman collection.

Good luck with your CityCare project! 🚀🏙️
