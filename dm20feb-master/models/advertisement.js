const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const mySchema = new Schema({
    
    createdOn: {
            type: Date,
            default: Date.now()
    },
    modifiedOn: {
            type: Date
    },
    expiresOn: {
        type: Date
    },
    status: {
            type: Boolean,
            default: false
    },
    ad: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Advertisement'
        },
        original: Object,
        type: Object
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pricing:  {
        name: String,
        price: Number,
        validityInDays: Number
    },
    companyName: String,
    fullName: String,
    email: String,
    mobile: Number,
    streetAddress: String,
    state: String,
    district: String,
    image: String,
    video: String
   
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
        model: mongoose.model("Advertisement", mySchema),
        schema: mySchema
};