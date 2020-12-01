const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const claimSchema = new Schema({

    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    mobile: {
        type: Number,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    proofFile: {
        type: String,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    previousUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdOn: {
        type: Date,
        default: new Date()
    },
    modifiedOn: {
        type: Date
    },
    resolved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    }

});

const sanitizerPlugin = require('mongoose-dompurify');

claimSchema.plugin(sanitizerPlugin, {
    // Do not sanitize these fields (default: [])
    skip: [],

    // Encode HTML entities? (default: false)
    encodeHtmlEntities: false,

    // Configure DOMPurify, see https://github.com/cure53/DOMPurify for a list of options (default: undefined)
    sanitizer: {
        SAFE_FOR_JQUERY: true,
        SAFE_FOR_TEMPLATES: true,
        ALLOWED_TAGS: []
    }
});

module.exports = {
    model: mongoose.model("Claim", claimSchema),
    schema: claimSchema
};