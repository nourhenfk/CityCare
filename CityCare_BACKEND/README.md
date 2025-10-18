# CityCare Backend API

Backend API for CityCare - An urban problem reporting application that allows citizens to report issues and municipalities to manage them.

## Features

- **Authentication**: JWT-based authentication with role management (USER, ADMIN)
- **Report Management**: Create, read, update, and delete urban problem reports
- **Image Upload**: Cloudinary integration for photo uploads
- **Geolocation**: Store and retrieve location data for reports
- **Role-Based Access**: Different permissions for citizens and administrators
- **Notifications**: System for notifying users about report status changes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Validation**: express-validator

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Cloudinary credentials

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Reports (Signalements)
- `GET /api/reports` - Get all reports (citizens see their own, admins see all)
- `GET /api/reports/:id` - Get single report details
- `POST /api/reports` - Create a new report (with image upload)
- `PUT /api/reports/:id` - Update report (admins can update status)
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/comment` - Add comment to report

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role

## Roles & Permissions

- **ROLE_USER** (Citizen): Can create reports, view their own reports, receive notifications
- **ROLE_ADMIN** (Administrator): Full access including viewing all reports, updating status, managing users

## Report Status Flow

1. **OUVERT** (Open) - Initial status when created
2. **EN_COURS** (In Progress) - Admin has started working on it
3. **RESOLU** (Resolved) - Problem has been fixed
4. **REJETE** (Rejected) - Report was invalid or duplicate

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
