const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - Represents both citizens and administrators
 * 
 * Roles:
 * - ROLE_USER: Regular citizen who can report problems
 * - ROLE_ADMIN: Administrator with full system access (manages all reports and users)
 */
const userSchema = new mongoose.Schema({
    // Basic user information
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },

    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },

    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false // Don't return password in queries by default
    },

    phone: {
        type: String,
        trim: true,
        match: [/^[+]?[\d\s()-]+$/, 'Veuillez fournir un numéro de téléphone valide']
    },

    // User role for authorization
    role: {
        type: String,
        enum: ['ROLE_USER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    },

    // Profile avatar (optional)
    avatar: {
        type: String, // URL to avatar image
        default: null
    },

    // Push notification token for mobile app
    pushToken: {
        type: String,
        default: null
    },

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },

    // Email verification (for future enhancement)
    isEmailVerified: {
        type: Boolean,
        default: false
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

/**
 * Pre-save hook to hash password before saving to database
 * Only hashes if password is new or modified
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare entered password with hashed password in database
 * @param {string} enteredPassword - Password to verify
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method to get user object without sensitive data
 * @returns {object} - User object without password
 */
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

/**
 * Static method to find user by email with password included
 * @param {string} email - User email
 * @returns {object} - User object with password
 */
userSchema.statics.findByCredentials = async function (email) {
    return await this.findOne({ email }).select('+password');
};

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
