const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdTypesForPostModel = require("./AdTypesForPost").model;

// unique: true,
const AdsPostFeatureSchema = new Schema({

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

AdsPostFeatureSchema.plugin(sanitizerPlugin, {
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


AdsPostFeatureSchema.pre('remove', async function(){
    console.log("AdTypesForPost ", this);
    console.log("AdTypesForPost id", this._id);
    const a = await AdTypesForPostModel.updateMany({
      "features.id": this._id
}, {
      $pull: {
          "features": { id: this._id } 
      }
});
    
      

    
    console.log('AdTypesForPost  pre remove Done',{a});
  });

  
module.exports = {
  model: mongoose.model("AdsPostFeature", AdsPostFeatureSchema),
  schema: AdsPostFeatureSchema
};