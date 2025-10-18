/**
 * Response helper functions for consistent API responses
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message, data = null) => {
    const response = {
        success: true,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errors - Validation errors (optional)
 */
const sendError = (res, statusCode = 500, message, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 */
const sendPaginatedResponse = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        count: data.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        data
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendPaginatedResponse
};
