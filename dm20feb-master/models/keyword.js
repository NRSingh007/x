const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordSchema = new Schema({
    name: {
            type: String, 
            unique : [true, 'keyword already exists'], 
            required : true, dropDups: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // category: [{
    //     name: String,
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Category'
    //     }
    // }],
    description: { type: String },
    createdOn: { type: Date},
    modifiedOn: { type: Date},
    old_id: Number,
    status: Boolean
});


const sanitizerPlugin = require('mongoose-dompurify');

keywordSchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("Keyword", keywordSchema), schema: keywordSchema };

