const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const mySchema = new Schema({
    name: {
            type: String,
            required: true,
            dropDups: true
    },
    description: {
            type: String
    },
    createdOn: {
            type: Date
    },
    modifiedOn: {
            type: Date
    },
    status: {
            type: Boolean,
            default: true
    },
    post: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        adType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdTypesForPost'
        },
        adContent : String
    },
    advertisement: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advertisement'
        },
        adType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdsLEDAndBanner'
        },
        adContent : String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
   
});

const sanitizerPlugin = require('mongoose-dompurify');

mySchema.plugin(sanitizerPlugin, {
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
        model: mongoose.model("Order", mySchema),
        schema: mySchema
};