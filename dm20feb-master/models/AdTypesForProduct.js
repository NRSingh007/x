const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// unique: true,
const AdTypesForProductSchema = new Schema({

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
  name: { type: String, unique: true },
  pricePerMonth: Number,
  validityIndays: Number,
  features: [
    {
      name: String,
      description: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdsProductFeature'
      }
    }
  ]
  // features: {
  //   visibility: {
  //     placeHolder: { type: String, default: 'Ad Visibility'},
  //     value: String
  //   },
  //   fixedPosition: {
  //     placeHolder: { type: String, default: 'Fixed Ad Position'},
  //     value: String
  //   },
  //   validity: {
  //     placeHolder: { type: String, default: 'Ad Validity'},
  //     value: String
  //   },
  //   viewsLimit: {
  //     placeHolder: { type: String, default: 'No. of Ad Views'},
  //     value: String
  //   },
  //   wordLimit: {
  //     placeHolder: { type: String, default: 'Word limit in Ad description'},
  //     value: String
  //   },
  //   noOfPhotosAllowed: {
  //     placeHolder: { type: String, default: 'No. of photos Allowed'},
  //     value: String
  //   },
  //   interestedUserDetails: {
  //     placeHolder: { type: String, default: 'Interested user details'},
  //     value: String
  //   },
  //   renewal: {
  //     placeHolder: { type: String, default: 'Ad Renewal'},
  //     value: String
  //   }
  // }

});

const sanitizerPlugin = require('mongoose-dompurify');

AdTypesForProductSchema.plugin(sanitizerPlugin, {
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



AdTypesForProductSchema.pre('remove', async function(){
  console.log("AdTypesForProduct ", this);
  console.log("AdTypesForProduct id", this._id);
  const a = await CategoryModel.updateMany({
    "productAdType.id": this._id
  }, {
          $unset: {
            productAdType: ""
          }
  });
  console.log('AdTypesForProduct pre remove Done',{a});
});


module.exports = {
  model: mongoose.model("AdTypesForProduct", AdTypesForProductSchema),
  schema: AdTypesForProductSchema
};