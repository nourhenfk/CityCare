const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

/**
 * User Management Routes
 * All routes require admin authentication
 */

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('ROLE_ADMIN'), getUserStats);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('ROLE_ADMIN'), getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', protect, authorize('ROLE_ADMIN'), getUser);

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', protect, authorize('ROLE_ADMIN'), updateUserRole);

// @route   PUT /api/users/:id/status
// @desc    Activate/Deactivate user account
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('ROLE_ADMIN'), toggleUserStatus);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('ROLE_ADMIN'), deleteUser);

module.exports = router;
