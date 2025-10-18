# 🎯 Quick Reference - CityCare Backend

## Server Info
- **URL:** http://localhost:5000
- **Database:** MongoDB (citycare_test)
- **Status:** ✅ Running and tested

## Test Users

### Regular User (ROLE_USER)
```
Email: test@citycare.com
Password: test123
```

### Admin User (ROLE_ADMIN)
```
Email: admin@citycare.com
Password: admin123
```

## Quick API Test Commands

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/"
```

### 2. Login and Get Token
```powershell
$body = @{ email = "test@citycare.com"; password = "test123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### 3. Get Current User
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
```

### 4. Get Reports
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/reports" -Method GET -Headers $headers
```

## Main Endpoints

### Public
- `GET /` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login

### Protected (Require JWT Token)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report (with image)
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/comment` - Add comment
- `POST /api/reports/:id/upvote` - Toggle upvote

### Admin Only
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Toggle user status
- `DELETE /api/users/:id` - Delete user

## Next Steps

1. ✅ **Backend tested** - All core features working
2. 🔲 **Add Cloudinary credentials** - Update `.env` file
3. 🔲 **Test image upload** - Use Postman
4. 🔲 **Connect frontend** - Your Ionic Angular app
5. 🔲 **Deploy** - Production environment

## Documentation Files

- **QUICK_START.md** - Getting started guide
- **INSTALLATION.md** - Detailed setup
- **API_DOCUMENTATION.md** - Complete API reference
- **TESTING_SUMMARY.md** - Test overview (⭐ START HERE)
- **TEST_RESULTS.md** - Detailed test results
- **test-api.ps1** - PowerShell test script

## Important Notes

⚠️ **Before Production:**
- Change JWT_SECRET in `.env`
- Add real Cloudinary credentials
- Use production MongoDB URI
- Set NODE_ENV=production

✅ **Ready For:**
- Frontend integration
- Image upload testing
- Mobile app development
- Production deployment

---

**Your backend is ready! Start building your frontend! 🚀**
