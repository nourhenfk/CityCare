const mongoose = require('mongoose');

/**
 * Report Schema - Represents urban problem reports (signalements)
 * 
 * A report contains information about an urban issue including:
 * - Description and category
 * - Photo evidence
 * - Geolocation
 * - Status tracking
 * - Comments/updates from admins
 */
const reportSchema = new mongoose.Schema({
    // Report title
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },

    // Detailed description of the problem
    description: {
        type: String,
        required: [true, 'La description est obligatoire'],
        trim: true,
        maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },

    // Category of the urban problem
    category: {
        type: String,
        required: [true, 'La catégorie est obligatoire'],
        enum: [
            'VOIRIE',           // Road/Street issues
            'ECLAIRAGE',        // Lighting
            'PROPRETE',         // Cleanliness/Waste
            'SIGNALISATION',    // Traffic signs
            'ESPACES_VERTS',    // Green spaces/Parks
            'MOBILIER_URBAIN',  // Urban furniture
            'GRAFFITI',         // Graffiti/Vandalism
            'NIDS_DE_POULE',    // Potholes
            'AUTRE'             // Other
        ]
    },

    // Photo of the problem (Cloudinary URL)
    imageUrl: {
        type: String,
        required: [true, 'Une photo est obligatoire']
    },

    // Cloudinary public_id for image management
    imagePublicId: {
        type: String,
        required: true
    },

    // Resolution image (when problem is fixed)
    resolutionImageUrl: {
        type: String,
        default: null
    },

    // Cloudinary public_id for resolution image
    resolutionImagePublicId: {
        type: String,
        default: null
    },

    // Geolocation data
    location: {
        // Geographic coordinates
        coordinates: {
            latitude: {
                type: Number,
                required: [true, 'La latitude est obligatoire'],
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                required: [true, 'La longitude est obligatoire'],
                min: -180,
                max: 180
            }
        },
        // Human-readable address (optional, can be obtained from reverse geocoding)
        address: {
            type: String,
            trim: true,
            default: ''
        },
        // City name
        city: {
            type: String,
            trim: true,
            default: ''
        }
    },

    // Report status tracking
    status: {
        type: String,
        enum: ['OUVERT', 'EN_COURS', 'RESOLU', 'REJETE'],
        default: 'OUVERT'
    },

    // Status history to track all changes
    statusHistory: [{
        status: {
            type: String,
            enum: ['OUVERT', 'EN_COURS', 'RESOLU', 'REJETE']
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        comment: {
            type: String,
            trim: true
        }
    }],

    // User who created the report
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Admin assigned to handle the report (optional)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Comments from admins or updates
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Priority level (can be set by admins)
    priority: {
        type: String,
        enum: ['BASSE', 'MOYENNE', 'HAUTE', 'URGENTE'],
        default: 'MOYENNE'
    },

    // Number of upvotes (citizens can upvote to show importance)
    upvotes: {
        type: Number,
        default: 0
    },

    // Users who upvoted this report
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    // Resolution date (when status changed to RESOLU)
    resolvedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

/**
 * Pre-save hook to update resolvedAt when status changes to RESOLU
 */
reportSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'RESOLU' && !this.resolvedAt) {
        this.resolvedAt = new Date();
    }
    next();
});

/**
 * Method to add a comment to the report
 * @param {string} userId - ID of user adding comment
 * @param {string} text - Comment text
 */
reportSchema.methods.addComment = function (userId, text) {
    this.comments.push({
        user: userId,
        text: text,
        createdAt: new Date()
    });
    return this.save();
};

/**
 * Method to update status and track history
 * @param {string} newStatus - New status value
 * @param {string} userId - ID of user changing status
 * @param {string} comment - Optional comment about status change
 */
reportSchema.methods.updateStatus = function (newStatus, userId, comment = '') {
    const oldStatus = this.status;
    this.status = newStatus;

    // Add to status history
    this.statusHistory.push({
        status: newStatus,
        changedBy: userId,
        changedAt: new Date(),
        comment: comment
    });

    // Set resolvedAt if status is RESOLU
    if (newStatus === 'RESOLU' && !this.resolvedAt) {
        this.resolvedAt = new Date();
    }

    return this.save();
};

/**
 * Method to toggle upvote from a user
 * @param {string} userId - ID of user upvoting
 * @returns {boolean} - True if upvoted, false if removed upvote
 */
reportSchema.methods.toggleUpvote = function (userId) {
    const index = this.upvotedBy.indexOf(userId);

    if (index === -1) {
        // User hasn't upvoted yet, add upvote
        this.upvotedBy.push(userId);
        this.upvotes += 1;
        return true;
    } else {
        // User already upvoted, remove upvote
        this.upvotedBy.splice(index, 1);
        this.upvotes -= 1;
        return false;
    }
};

// Create indexes for better query performance
reportSchema.index({ createdBy: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

module.exports = mongoose.model('Report', reportSchema);
