const express = require('express');
const router = express.Router();
const {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    addComment,
    toggleUpvote,
    getReportStats
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware/upload');

/**
 * Report Routes
 * All routes require authentication
 */

// @route   GET /api/reports/stats
// @desc    Get report statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('ROLE_ADMIN'), getReportStats);

// @route   GET /api/reports
// @desc    Get all reports (citizens see their own, agents see all)
// @access  Private
router.get('/', protect, getReports);

// @route   GET /api/reports/:id
// @desc    Get single report by ID
// @access  Private
router.get('/:id', protect, getReport);

// @route   POST /api/reports
// @desc    Create new report (with image upload)
// @access  Private
router.post('/', protect, uploadMiddleware, createReport);

// @route   PUT /api/reports/:id
// @desc    Update report (with optional resolution image upload)
// @access  Private
router.put('/:id', protect, uploadMiddleware, updateReport);

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', protect, deleteReport);

// @route   POST /api/reports/:id/comment
// @desc    Add comment to report
// @access  Private
router.post('/:id/comment', protect, addComment);

// @route   POST /api/reports/:id/upvote
// @desc    Toggle upvote on report
// @access  Private
router.post('/:id/upvote', protect, toggleUpvote);

module.exports = router;
