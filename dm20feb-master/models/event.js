const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


const eventSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    address: {
        state: {
            
                type: Schema.Types.ObjectId,
                ref: 'State'
        },
        district: {
                type: Schema.Types.ObjectId,
                ref: 'District'
        },
        locality: {
            
                type: Schema.Types.ObjectId,
                ref: 'Locality'
        },
        street_address: {
            type: String,
            required: true
        }
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    timings: {
        date: {
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
                required: true
            }
        },
        time: {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            }
        }
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }


});
// districtSchema.plugin(uniqueValidator);

const sanitizerPlugin = require('mongoose-dompurify');

eventSchema.plugin(sanitizerPlugin, {
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
    model: mongoose.model("Event", eventSchema),
    schema: eventSchema
};