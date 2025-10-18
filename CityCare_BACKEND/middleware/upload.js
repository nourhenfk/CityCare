const multer = require('multer');

/**
 * Multer configuration for handling file uploads
 * Stores files in memory as Buffer for direct Cloudinary upload
 */

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers image sont autorisés (JPEG, PNG, GIF)'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // Default 5MB
    },
    fileFilter: fileFilter
});

/**
 * Middleware to handle single image upload
 */
const uploadSingle = upload.single('image');

/**
 * Custom upload middleware with error handling
 */
const uploadMiddleware = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Le fichier est trop volumineux. Taille maximale: 5MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: `Erreur d'upload: ${err.message}`
            });
        } else if (err) {
            // Other errors
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // No error, proceed
        next();
    });
};

module.exports = { uploadMiddleware, upload };
