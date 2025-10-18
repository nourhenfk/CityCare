const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary for image upload
 * Uses credentials from environment variables
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
const uploadToCloudinary = (fileBuffer, folder = 'citycare/reports') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Limit max dimensions
                    { quality: 'auto' }, // Automatic quality optimization
                    { fetch_format: 'auto' } // Automatic format selection
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );

        // Convert buffer to stream and pipe to cloudinary
        const { Readable } = require('stream');
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
    });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de l'image: ${error.message}`);
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
};
