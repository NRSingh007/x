const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const removeTags = require('./../utils/functions').removeTags;
const sanitizeHtml = require('./../utils/functions').sanitizeHtml;
// var sanitizerPlugin = require('mongoose-sanitizer');

const UserModel = require("./../models/user").model;


const Schema = mongoose.Schema;

const reviewSchema = new Schema();
const fields = {
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  message: {
    type: String,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [{
    url: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdOn: {
    type: Date
  },
  modifiedOn: {
    type: Date
  },
  deletedOn: {
    type: Date
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
};

reviewSchema.add({

  ...fields,
  replies: [{
    ...fields
  }]

});

reviewSchema.virtual('totalLikes').get(function () {
  return this.likes ? this.likes.length : 0;
});

const sanitizerPlugin = require('mongoose-dompurify');

reviewSchema.plugin(sanitizerPlugin, {
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



reviewSchema.pre('remove', async function(){
  console.log("Review pre remove hook ");
  console.log("Review id", this._id);
  const a = await UserModel.updateMany({
        reviews: this._id
    }, {
        $pull: {
          reviews: this._id 
        }
    });

    console.log({a});
});
  
    


module.exports = {
  model: mongoose.model("Review", reviewSchema),
  schema: reviewSchema
};