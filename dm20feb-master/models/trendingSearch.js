const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trendingSearchSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // search counts for each state and unique person
    count: {
        type: Number,
        default: 0
    },
    states: [
        {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'State'
            }
        }
    ],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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
    }
});

const sanitizerPlugin = require('mongoose-dompurify');

trendingSearchSchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("trendingSearch", trendingSearchSchema), schema: trendingSearchSchema };

