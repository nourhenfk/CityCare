const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes - Verify JWT token
 * Extracts user from token and attaches to request
 */
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Check if user is active
            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte utilisateur désactivé'
                });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Non autorisé, token invalide'
            });
        }
    }

    // No token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Non autorisé, aucun token fourni'
        });
    }
};

/**
 * Middleware to authorize based on user roles
 * @param  {...string} roles - Allowed roles (ROLE_USER, ROLE_ADMIN)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
            });
        }

        next();
    };
};

/**
 * Generate JWT token for user
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

module.exports = { protect, authorize, generateToken };
