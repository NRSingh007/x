const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


const collectionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
        name: {
                type: String,
                required: true
        },
        description: {
            type: String,
            required: true
        },
        coverImage: {
                type: String,
                required: true
        },
        places: [
                {
                        id: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: 'Post'
                            },
                        name: String,
                        district: String,
                        locality: String,
                        state: String
                }
        ],
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isAdmin: {
                type: Boolean,
                default: true
        }
        

});
// districtSchema.plugin(uniqueValidator);

const sanitizerPlugin = require('mongoose-dompurify');

collectionSchema.plugin(sanitizerPlugin, {
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
module.exports = { model: mongoose.model("StaticCollection", collectionSchema), schema: collectionSchema };

