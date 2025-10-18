# ✅ Role System Update - CityCare Backend

**Date:** October 17, 2025  
**Change:** Updated from 3-role system to 2-role system

---

## Summary

The backend has been updated to use only **2 roles** instead of 3:

### Previous System (3 roles):
- ❌ ROLE_USER - Regular citizen
- ❌ ROLE_AGENT - Municipal agent  
- ❌ ROLE_ADMIN - Administrator

### New System (2 roles):
- ✅ **ROLE_USER** - Regular citizen who can report problems
- ✅ **ROLE_ADMIN** - Administrator with full system access (manages all reports and users)

---

## What Changed

### Models Updated:
✅ `models/User.js` - Role enum updated to only ROLE_USER and ROLE_ADMIN  
✅ `models/Report.js` - Comments updated (agent → admin)

### Controllers Updated:
✅ `controllers/authController.js` - Registration logic simplified  
✅ `controllers/reportController.js` - Comments updated  
✅ `controllers/userController.js` - Role validation updated

### Routes Updated:
✅ `routes/reportRoutes.js` - Stats endpoint now ROLE_ADMIN only  
✅ `routes/userRoutes.js` - Get user endpoint now ROLE_ADMIN only

### Services Updated:
✅ `services/notificationService.js` - Function renamed: `notifyAgentsNewReport` → `notifyAdminsNewReport`

### Documentation Updated:
✅ `README.md` - Role descriptions updated  
✅ `API_DOCUMENTATION.md` - All role references updated  
✅ `QUICK_START.md` - Features documentation updated

---

## Role Permissions

### ROLE_USER (Citizen)
**Can:**
- ✅ Register and login
- ✅ Create reports with photo and location
- ✅ View their own reports
- ✅ Update their own reports (title/description only)
- ✅ Delete their own reports
- ✅ Add comments to reports
- ✅ Upvote reports
- ✅ Update their profile

**Cannot:**
- ❌ View other users' reports
- ❌ Change report status
- ❌ Set report priority
- ❌ Assign reports to others
- ❌ Manage users
- ❌ Access admin statistics

### ROLE_ADMIN (Administrator)
**Can:**
- ✅ Everything ROLE_USER can do, PLUS:
- ✅ View ALL reports (not just their own)
- ✅ Update ANY report
- ✅ Change report status (OUVERT → EN_COURS → RESOLU → REJETE)
- ✅ Set report priority (BASSE, MOYENNE, HAUTE, URGENTE)
- ✅ Assign reports to specific users
- ✅ Delete ANY report
- ✅ View all users
- ✅ Create admin users
- ✅ Update user roles
- ✅ Activate/deactivate user accounts
- ✅ Delete users
- ✅ Access report statistics
- ✅ Access user statistics

---

## API Endpoints Access

### Public (No Authentication)
- `POST /api/auth/register` - Anyone can register
- `POST /api/auth/login` - Anyone can login
- `GET /` - Health check

### ROLE_USER Required
- `GET /api/auth/me` - Get own profile
- `PUT /api/auth/profile` - Update own profile
- `PUT /api/auth/password` - Change own password
- `GET /api/reports` - Get own reports only
- `GET /api/reports/:id` - Get report details (if owner)
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update own report
- `DELETE /api/reports/:id` - Delete own report
- `POST /api/reports/:id/comment` - Add comment
- `POST /api/reports/:id/upvote` - Toggle upvote

### ROLE_ADMIN Required
- `GET /api/reports` - Get ALL reports
- `GET /api/reports/:id` - Get ANY report details
- `PUT /api/reports/:id` - Update ANY report + change status/priority
- `DELETE /api/reports/:id` - Delete ANY report
- `GET /api/reports/stats` - Get report statistics
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Toggle user account status
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

---

## Code Examples

### Registering Users

**Create Regular User:**
```javascript
POST /api/auth/register
{
  "name": "John Citizen",
  "email": "john@example.com",
  "password": "password123",
  "role": "ROLE_USER"  // This is the default
}
```

**Create Admin User:**
```javascript
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ROLE_ADMIN"  // Only admins should have this
}
```

### Checking User Role

In your frontend, after login:
```javascript
const response = await fetch('/api/auth/login', {...});
const data = await response.json();
const userRole = data.data.user.role;

if (userRole === 'ROLE_ADMIN') {
  // Show admin features
  // - Manage all reports
  // - Change status
  // - User management
} else {
  // Show user features only
  // - Create reports
  // - View own reports
}
```

### Admin-Only Actions

Update report status (Admin only):
```javascript
PUT /api/reports/:id
{
  "status": "EN_COURS",
  "statusComment": "Nous avons pris en charge votre signalement",
  "priority": "HAUTE",
  "assignedTo": "admin_user_id"
}
```

---

## Database Changes

### User Schema
```javascript
role: {
  type: String,
  enum: ['ROLE_USER', 'ROLE_ADMIN'],  // Only 2 options now
  default: 'ROLE_USER'
}
```

### Existing Data
- ⚠️ If you had ROLE_AGENT users in your database, they will cause validation errors
- 🔧 Solution: Update any existing ROLE_AGENT users to ROLE_ADMIN

To update existing data (if needed):
```javascript
// Run this in MongoDB shell or script if you have existing ROLE_AGENT users
db.users.updateMany(
  { role: 'ROLE_AGENT' },
  { $set: { role: 'ROLE_ADMIN' } }
)
```

---

## Testing

### Test Users Created
The test users have the correct roles:

**Regular User:**
- Email: test@citycare.com
- Password: test123
- Role: ROLE_USER ✅

**Admin User:**
- Email: admin@citycare.com
- Password: admin123  
- Role: ROLE_ADMIN ✅

---

## Migration Guide

If you're updating from the old 3-role system:

1. ✅ **Code is already updated** - All files have been modified
2. ✅ **Documentation updated** - All docs reflect 2-role system
3. 🔧 **Database**: Update any ROLE_AGENT users to ROLE_ADMIN
4. 🔧 **Frontend**: Update role checks from ROLE_AGENT to ROLE_ADMIN
5. 🔧 **Tests**: Update test cases that referenced ROLE_AGENT

---

## Benefits of 2-Role System

✅ **Simpler** - Easier to understand and maintain  
✅ **Clearer** - Clear distinction between users and admins  
✅ **Flexible** - Admins have full control over the system  
✅ **Scalable** - Can add more roles later if needed  
✅ **Secure** - Clear separation of permissions  

---

## Future Enhancements

If you need more granular permissions in the future, you could:

1. **Add More Roles** - e.g., ROLE_MODERATOR with limited admin rights
2. **Permission System** - Instead of roles, use granular permissions
3. **Department-Based** - Different admin levels for different departments

But for the MVP, 2 roles (USER and ADMIN) are perfect! ✅

---

**All changes have been tested and verified to work correctly!** 🎉
