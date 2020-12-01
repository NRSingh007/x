const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const AdsLedAndBannerSchema = new Schema({

  createdOn: {
    type: Date,
    default: new Date()
  },
  modifiedOn: {
    type: Date,
    default: new Date()
  },
  status: {
    type: Boolean,
    default: true
  },
  // name: { type: String, unique: true },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdsLedAndBannerAndOthersType'
  },
  pricings: [
      {
          name: String,
          price: Number,
          validityInDays: Number
      }
  ],
  features: [
    {
      name: String,
      description: String
      
    }
  ]

});

const sanitizerPlugin = require('mongoose-dompurify');

AdsLedAndBannerSchema.plugin(sanitizerPlugin, {
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
  model: mongoose.model("AdsLEDAndBanner", AdsLedAndBannerSchema),
  schema: AdsLedAndBannerSchema
};