const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const localitySchema = new Schema({
    name: {
        type: String,
        unique : false, required : true, dropDups: false 
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    status: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdOn: {
        type: Date,
        required: true
    },
    modifiedOn: {
        type: Date,
        required: true
    },
    pincode: {
        type: Number,
        minlength: 6,
        maxlength: 6

    },
    availableCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],
    images: {
        xs: { url: String, title: String },
        sm: { url: String, title: String },
        md: { url: String, title: String },
        lg: { url: String, title: String },
        xl: { url: String, title: String },
        landscape_xs: { url: String, title: String },
        landscape_sm: { url: String, title: String },
        landscape_md: { url: String, title: String },
        landscape_lg: { url: String, title: String },
        landscape_xl: { url: String, title: String },
        collection: [{ url: String, title: String }]
    },
    description: {
        short: String,
        medium: String,
        long: String
    },
    old_id: Number
});

const sanitizerPlugin = require('mongoose-dompurify');

localitySchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("Locality", localitySchema), schema: localitySchema };

