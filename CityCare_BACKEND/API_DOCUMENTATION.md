# API Documentation - CityCare Backend

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+212612345678",
  "role": "ROLE_USER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ROLE_USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+212612345679",
  "pushToken": "ExponentPushToken[...]"
}
```

### Update Password
**PUT** `/auth/password`

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Report Endpoints

### Get All Reports
**GET** `/reports`

Get all reports. Citizens see only their reports, admins see all.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` - Filter by status (OUVERT, EN_COURS, RESOLU, REJETE)
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: -createdAt)

**Example:** `/reports?status=OUVERT&page=1&limit=10`

### Get Single Report
**GET** `/reports/:id`

Get detailed information about a specific report.

**Headers:** `Authorization: Bearer <token>`

### Create Report
**POST** `/reports`

Create a new report with photo upload.

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` - Report title (required)
- `description` - Detailed description (required)
- `category` - Problem category (required)
- `latitude` - Latitude coordinate (required)
- `longitude` - Longitude coordinate (required)
- `address` - Human-readable address (optional)
- `city` - City name (optional)
- `image` - Image file (required, max 5MB)

**Example using JavaScript Fetch:**
```javascript
const formData = new FormData();
formData.append('title', 'Nid de poule dangereux');
formData.append('description', 'Un grand nid de poule...');
formData.append('category', 'NIDS_DE_POULE');
formData.append('latitude', '33.5731');
formData.append('longitude', '-7.5898');
formData.append('image', imageFile);

fetch('http://localhost:5000/api/reports', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Update Report
**PUT** `/reports/:id`

Update report information. Citizens can only update title/description. Admins can update status, priority, etc.

**Headers:** `Authorization: Bearer <token>`

**Request Body (Citizen):**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Request Body (Admin):**
```json
{
  "status": "EN_COURS",
  "statusComment": "Nous avons pris en charge votre signalement",
  "priority": "HAUTE",
  "assignedTo": "admin_user_id"
}
```

### Delete Report
**DELETE** `/reports/:id`

Delete a report. Only creator or admin can delete.

**Headers:** `Authorization: Bearer <token>`

### Add Comment
**POST** `/reports/:id/comment`

Add a comment to a report.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Nous avons envoyé une équipe pour évaluer le problème."
}
```

### Toggle Upvote
**POST** `/reports/:id/upvote`

Upvote or remove upvote from a report.

**Headers:** `Authorization: Bearer <token>`

### Get Report Statistics
**GET** `/reports/stats`

Get statistics about reports (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": [
      { "_id": "OUVERT", "count": 45 },
      { "_id": "EN_COURS", "count": 30 },
      { "_id": "RESOLU", "count": 70 },
      { "_id": "REJETE", "count": 5 }
    ],
    "byCategory": [...],
    "recentReports": [...]
  }
}
```

---

## User Management Endpoints (Admin Only)

### Get All Users
**GET** `/users`

Get list of all users.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

**Query Parameters:**
- `role` - Filter by role
- `page` - Page number
- `limit` - Items per page

### Get User by ID
**GET** `/users/:id`

Get specific user information.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

### Update User Role
**PUT** `/users/:id/role`

Change user's role.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

**Request Body:**
```json
{
  "role": "ROLE_ADMIN"
}
```

### Toggle User Status
**PUT** `/users/:id/status`

Activate or deactivate user account.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

### Delete User
**DELETE** `/users/:id`

Delete a user account.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

### Get User Statistics
**GET** `/users/stats`

Get statistics about users.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** ROLE_ADMIN

---

## Report Categories

- `VOIRIE` - Road/Street issues
- `ECLAIRAGE` - Lighting problems
- `PROPRETE` - Cleanliness/Waste
- `SIGNALISATION` - Traffic signs
- `ESPACES_VERTS` - Green spaces/Parks
- `MOBILIER_URBAIN` - Urban furniture
- `GRAFFITI` - Graffiti/Vandalism
- `NIDS_DE_POULE` - Potholes
- `AUTRE` - Other

## Report Status

- `OUVERT` - Open (initial status)
- `EN_COURS` - In progress
- `RESOLU` - Resolved
- `REJETE` - Rejected

## User Roles

- `ROLE_USER` - Regular citizen
- `ROLE_ADMIN` - Administrator with full system access

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message description"
}
```

Common HTTP status codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized (invalid/missing token)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found
- 500 - Internal Server Error
