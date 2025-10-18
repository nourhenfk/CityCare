const Report = require('../models/Report');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Private
 * @note    Citizens see only their reports, Admins see all
 */
const getReports = async (req, res, next) => {
    try {
        const { status, category, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;

        // Build query
        let query = {};

        // If user is a citizen (ROLE_USER), only show their reports
        if (req.user.role === 'ROLE_USER') {
            query.createdBy = req.user.id;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with pagination
        const reports = await Report.find(query)
            .populate('createdBy', 'name email avatar')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name avatar')
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Report.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reports.length,
            total: total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: reports
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single report by ID
 * @route   GET /api/reports/:id
 * @access  Private
 */
const getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('createdBy', 'name email phone avatar')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name avatar')
            .populate('statusHistory.changedBy', 'name');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        // Check authorization - citizens can only view their own reports
        if (req.user.role === 'ROLE_USER' && report.createdBy._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à accéder à ce signalement'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new report
 * @route   POST /api/reports
 * @access  Private
 */
const createReport = async (req, res, next) => {
    try {
        const { title, description, category, latitude, longitude, address, city } = req.body;

        // Validate required fields
        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir tous les champs requis'
            });
        }

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir une photo'
            });
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'citycare/reports');

        // Create report
        const report = await Report.create({
            title,
            description,
            category,
            imageUrl: uploadResult.url,
            imagePublicId: uploadResult.publicId,
            location: {
                coordinates: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                },
                address: address || '',
                city: city || ''
            },
            createdBy: req.user.id,
            status: 'OUVERT',
            statusHistory: [{
                status: 'OUVERT',
                changedBy: req.user.id,
                changedAt: new Date(),
                comment: 'Signalement créé'
            }]
        });

        // Populate creator info
        await report.populate('createdBy', 'name email avatar');

        res.status(201).json({
            success: true,
            message: 'Signalement créé avec succès',
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update report
 * @route   PUT /api/reports/:id
 * @access  Private
 */
const updateReport = async (req, res, next) => {
    try {
        let report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        // Check authorization
        // Citizens can only update their own reports and only certain fields
        if (req.user.role === 'ROLE_USER') {
            if (report.createdBy.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Non autorisé à modifier ce signalement'
                });
            }
            // Citizens can only update title and description
            const { title, description } = req.body;
            if (title) report.title = title;
            if (description) report.description = description;
        } else {
            // Admins can update more fields
            const { title, description, status, priority, assignedTo } = req.body;

            if (title) report.title = title;
            if (description) report.description = description;
            if (priority) report.priority = priority;
            if (assignedTo) report.assignedTo = assignedTo;

            // Handle resolution image upload if provided
            if (req.file && status === 'RESOLU') {
                const uploadResult = await uploadToCloudinary(req.file.buffer, 'citycare/resolutions');
                report.resolutionImageUrl = uploadResult.url;
                report.resolutionImagePublicId = uploadResult.publicId;
            }

            // Handle status update with history
            if (status && status !== report.status) {
                await report.updateStatus(status, req.user.id, req.body.statusComment || '');
            }
        }

        await report.save();

        // Populate and return updated report
        report = await Report.findById(report._id)
            .populate('createdBy', 'name email avatar')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Signalement mis à jour avec succès',
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
const deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        // Check authorization
        // Only creator or admin can delete
        if (req.user.role === 'ROLE_USER' && report.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à supprimer ce signalement'
            });
        }

        // Delete image from Cloudinary
        if (report.imagePublicId) {
            await deleteFromCloudinary(report.imagePublicId);
        }

        // Delete report
        await report.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Signalement supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add comment to report
 * @route   POST /api/reports/:id/comment
 * @access  Private
 */
const addComment = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Le texte du commentaire est requis'
            });
        }

        let report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        // Add comment
        await report.addComment(req.user.id, text);

        // Populate and return updated report
        report = await Report.findById(report._id)
            .populate('createdBy', 'name email avatar')
            .populate('comments.user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Commentaire ajouté avec succès',
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle upvote on report
 * @route   POST /api/reports/:id/upvote
 * @access  Private
 */
const toggleUpvote = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        // Toggle upvote
        const isUpvoted = report.toggleUpvote(req.user.id);
        await report.save();

        res.status(200).json({
            success: true,
            message: isUpvoted ? 'Signalement soutenu' : 'Soutien retiré',
            data: {
                upvotes: report.upvotes,
                isUpvoted: isUpvoted
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get report statistics (for admins)
 * @route   GET /api/reports/stats
 * @access  Private (Admin only)
 */
const getReportStats = async (req, res, next) => {
    try {
        // Get counts by status
        const statusStats = await Report.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get counts by category
        const categoryStats = await Report.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get total count
        const total = await Report.countDocuments();

        // Get recent reports
        const recentReports = await Report.find()
            .sort('-createdAt')
            .limit(5)
            .populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            data: {
                total,
                byStatus: statusStats,
                byCategory: categoryStats,
                recentReports
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    addComment,
    toggleUpvote,
    getReportStats
};
