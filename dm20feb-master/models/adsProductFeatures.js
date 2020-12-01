const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdTypesForProductModel = require("./AdTypesForProduct").model;

// unique: true,
const AdsProductFeatureSchema = new Schema({

  createdOn: {
    type: Date
  },
  modifiedOn: {
    type: Date
  },
  status: {
    type: Boolean,
    default: true
  },
  name: { type: String, unique: true, trim: true }
  
});

const sanitizerPlugin = require('mongoose-dompurify');

AdsProductFeatureSchema.plugin(sanitizerPlugin, {
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


AdsProductFeatureSchema.pre('remove', async function(){
    console.log("AdTypesForPost ", this);
    console.log("AdTypesForPost id", this._id);
    const b = await AdTypesForProductModel.updateMany({
            "features.id": this._id
    }, {
            $pull: {
                "features": { id: this._id } 
            }
    });

    
    console.log(' AdTypesForProduct pre remove Done',{ b});
  });

  
module.exports = {
  model: mongoose.model("AdsProductFeature", AdsProductFeatureSchema),
  schema: AdsProductFeatureSchema
};