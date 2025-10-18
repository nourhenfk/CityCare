/**
 * Validation helper functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s()-]+$/;
    return phoneRegex.test(phone);
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @returns {boolean}
 */
const isValidCoordinates = (latitude, longitude) => {
    return (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, message: string }
 */
const validatePasswordStrength = (password) => {
    if (password.length < 6) {
        return {
            valid: false,
            message: 'Le mot de passe doit contenir au moins 6 caractères'
        };
    }

    // You can add more password strength requirements here
    // For example: uppercase, lowercase, numbers, special characters

    return { valid: true, message: 'Mot de passe valide' };
};

/**
 * Sanitize string input (prevent XSS)
 * @param {string} str - String to sanitize
 * @returns {string}
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    return str
        .trim()
        .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
        .substring(0, 1000); // Limit length
};

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidCoordinates,
    validatePasswordStrength,
    sanitizeString
};
