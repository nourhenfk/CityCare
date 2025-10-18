require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

/**
 * Initialize Express app
 */
const app = express();

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * Middleware
 */

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * API Routes
 */

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CityCare API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API v1 routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

/**
 * Error handling
 */

// Handle 404 - Route not found
app.use(notFound);

// Global error handler
app.use(errorHandler);

/**
 * Start server
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 CityCare Backend Server`);
    console.log(`=================================`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/`);
    console.log('=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;
