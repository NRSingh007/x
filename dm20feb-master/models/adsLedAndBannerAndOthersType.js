const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AdTypesForPostModel = require("./AdTypesForPost").model;

// unique: true,
const mySchema = new Schema({

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
  features: {
    video: {
      type: Boolean,
      default: false
    },
    image: {
      type: Boolean,
      default: false
    }
  },
  name: { type: String, unique: true, trim: true }
  
});

const sanitizerPlugin = require('mongoose-dompurify');

mySchema.plugin(sanitizerPlugin, {
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


// mySchema.pre('remove', async function(){
//     console.log("AdTypesForPost ", this);
//     console.log("AdTypesForPost id", this._id);
//     const a = await AdTypesForPostModel.updateMany({
//       "features.id": this._id
// }, {
//       $pull: {
//           "features": { id: this._id } 
//       }
// });
    
      

    
//     console.log('AdTypesForPost  pre remove Done',{a});
//   });

  
module.exports = {
  model: mongoose.model("AdsLedAndBannerAndOthersType", mySchema),
  schema: mySchema
};