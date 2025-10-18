# CityCare Backend - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

## Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project directory and run:

```powershell
npm install
```

This will install all required packages listed in `package.json`.

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```powershell
Copy-Item .env.example .env
```

2. Open the `.env` file and update the following values:

### Required Configuration:

#### MongoDB Connection
```
MONGODB_URI=mongodb://localhost:27017/citycare
```
Or if using MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/citycare
```

#### JWT Secret
Generate a secure random string for JWT_SECRET:
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

#### Cloudinary Configuration
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Update these values:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### CORS Origin (Frontend URL)
```
CORS_ORIGIN=http://localhost:8100
```
Update this to your Ionic app's URL.

## Step 3: Start MongoDB

### Option A: Local MongoDB
If you installed MongoDB locally, start it:

```powershell
# Windows
mongod

# Or if MongoDB is installed as a service
net start MongoDB
```

### Option B: MongoDB Atlas
If using MongoDB Atlas, no action needed - just ensure your connection string is correct in `.env`.

## Step 4: Run the Application

### Development Mode (with auto-reload)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

The server will start on `http://localhost:5000`

## Step 5: Verify Installation

1. Open your browser and go to: `http://localhost:5000`
2. You should see a JSON response:
```json
{
  "success": true,
  "message": "CityCare API is running",
  "version": "1.0.0"
}
```

## Step 6: Create Your First Admin User

You can use an API testing tool like:
- Postman - [Download](https://www.postman.com/downloads/)
- Thunder Client (VS Code extension)
- Or use PowerShell's `Invoke-RestMethod`

### Using PowerShell:
```powershell
$body = @{
    name = "Admin User"
    email = "admin@citycare.com"
    password = "admin123"
    role = "ROLE_ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Using Postman:
1. Create a POST request to `http://localhost:5000/api/auth/register`
2. Set Content-Type to `application/json`
3. Body:
```json
{
  "name": "Admin User",
  "email": "admin@citycare.com",
  "password": "admin123",
  "role": "ROLE_ADMIN"
}
```

Save the returned `token` for authenticated requests.

## Testing the API

### Test Login
```powershell
$loginBody = @{
    email = "admin@citycare.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### Test Creating a Report (requires image file)
Use Postman or a similar tool since PowerShell doesn't easily handle multipart/form-data.

## Project Structure

```
CityCare_BACKEND/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary setup
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── reportController.js
│   └── userController.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── error.js         # Error handling
│   └── upload.js        # File upload handling
├── models/              # Database models
│   ├── User.js
│   └── Report.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── reportRoutes.js
│   └── userRoutes.js
├── services/            # Business logic
│   └── notificationService.js
├── utils/               # Helper functions
│   ├── validators.js
│   └── responseHelper.js
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment file
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
├── server.js           # Main application file
└── README.md           # Documentation
```

## Common Issues & Solutions

### Issue: MongoDB connection error
**Solution:** 
- Ensure MongoDB is running
- Check your MONGODB_URI in `.env`
- If using MongoDB Atlas, check network access settings

### Issue: Port 5000 already in use
**Solution:** 
Change the PORT in `.env`:
```
PORT=3000
```

### Issue: Cloudinary upload fails
**Solution:**
- Verify your Cloudinary credentials in `.env`
- Check that your Cloudinary account is active
- Ensure the image file is under 5MB

### Issue: JWT token invalid
**Solution:**
- Ensure you're including the token in the Authorization header
- Format: `Bearer <token>`
- Check that JWT_SECRET matches between environments

## Next Steps

1. Read the `API_DOCUMENTATION.md` for detailed API usage
2. Test all endpoints using Postman or similar tool
3. Connect your Ionic frontend to this backend
4. Set up push notifications (see `notificationService.js`)
5. Deploy to production (Heroku, DigitalOcean, AWS, etc.)

## Support

For issues or questions:
- Check the documentation files
- Review the code comments
- Test with Postman to isolate issues

## Security Notes for Production

Before deploying to production:
1. Change JWT_SECRET to a strong random string
2. Enable HTTPS
3. Set NODE_ENV to 'production'
4. Review CORS settings
5. Implement rate limiting
6. Set up proper logging
7. Use environment-specific .env files
8. Never commit .env to version control

---

Happy coding! 🚀
