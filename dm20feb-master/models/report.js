const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const removeTags = require('./../utils/functions').removeTags;
const sanitizeHtml = require('./../utils/functions').sanitizeHtml;
// var sanitizerPlugin = require('mongoose-sanitizer');
const ReviewModel = require("./../models/review").model;

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  comment: {
    type: String,
  },
  reasons: [{ type: String }],
  review: {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  },
  reviewUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
    default: false,
    required: true
  }
});

const sanitizerPlugin = require('mongoose-dompurify');

reportSchema.plugin(sanitizerPlugin, {
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



reportSchema.pre('remove', async function(){
  // console.log("Report Review pre remove hook ");
  // console.log("Review id", this._id);
  // const review = await ReviewModel.findOne({ _id: this.review});
  // const deleted = await review.remove();
  //   console.log({deleted});
});
  

module.exports = {
  model: mongoose.model("Report", reportSchema),
  schema: reportSchema
};