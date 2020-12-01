const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const countrySchema = new Schema({
        
        name: {
                type: String,
                required: true,
        },
        status: {
                type: Boolean,
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
        }
});
// countrySchema.plugin(uniqueValidator);

const sanitizerPlugin = require('mongoose-dompurify');

countrySchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("Country", countrySchema), schema: countrySchema };
