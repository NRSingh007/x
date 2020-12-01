const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeyToPostSchema = new Schema({
    key_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Keyword'
    },
    // post_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // },
    createdOn: { type: Date, required: true },
    modifiedOn: { type: Date, required: true },
    old_post_id: Number,
    old_key_id: Number,
    status: Boolean
});


const sanitizerPlugin = require('mongoose-dompurify');

KeyToPostSchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("keywordToPost", KeyToPostSchema), schema: KeyToPostSchema };

