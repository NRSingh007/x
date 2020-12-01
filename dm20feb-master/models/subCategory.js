const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema();
subCategorySchema.add({
    name: {
        type: String, required: true
    },
    description: { type: String },
    // subCategory: [{
    //         categorySchema
    // }],
    createdOn: { type: Date },
    modifiedOn: { type: Date },
    status: { type: Boolean, default: true },
    old_id: Number
});
const sanitizerPlugin = require('mongoose-dompurify');

subCategorySchema.plugin(sanitizerPlugin, {
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

module.exports = { model: mongoose.model("SubCategory", subCategorySchema), schema: subCategorySchema };

