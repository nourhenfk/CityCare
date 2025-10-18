const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res, next) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;

        // Build query
        let query = {};
        if (role) {
            query.role = role;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total: total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin only)
 */
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user role
 * @route   PUT /api/users/:id/role
 * @access  Private (Admin only)
 */
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role || !['ROLE_USER', 'ROLE_ADMIN'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Prevent changing own role
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas modifier votre propre rôle'
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Rôle utilisateur mis à jour avec succès',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Deactivate/Activate user account
 * @route   PUT /api/users/:id/status
 * @access  Private (Admin only)
 */
const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Prevent changing own status
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas modifier votre propre statut'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Compte ${user.isActive ? 'activé' : 'désactivé'} avec succès`,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Prevent deleting own account
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas supprimer votre propre compte'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private (Admin only)
 */
const getUserStats = async (req, res, next) => {
    try {
        // Get counts by role
        const roleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get total count
        const total = await User.countDocuments();

        // Get active/inactive counts
        const activeCount = await User.countDocuments({ isActive: true });
        const inactiveCount = await User.countDocuments({ isActive: false });

        res.status(200).json({
            success: true,
            data: {
                total,
                active: activeCount,
                inactive: inactiveCount,
                byRole: roleStats
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getUserStats
};
