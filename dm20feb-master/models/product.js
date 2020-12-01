const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const productSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
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
    view_seller_info: {
        type: Boolean,
        default: false
    }
    ,
    product_status: {
        type: String,
        required: true,
        default: 'inactive'
    },
    product_verified: {
        type: Boolean,
        required: true,
        default: false
    },
    product_ad_type: {
        type: Schema.Types.ObjectId,
        ref: 'AdTypesForProduct'
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    product_ad_id: {
        type: String,
        required: true
    },
    product_category: {
        type: String,
        required: true
    },
    product_sub_category: {
        type: String,
        required: true
    },
    product_ad_title: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_price_updated: {
        type: Number,
        default: 0
    },
    product_photos: [{
        photo: {
            image_id: {
                type: String,
                required: true,
            },
            image_filename: {
                type: String,
                required: true,
            }
        }
    }],

    product_description: {
        type: String,
        required: true
    },
    product_brand: {
        type: Schema.Types.ObjectId,
        ref: "ProductBrand"
    },
    product_condition: {
        type: String,
        default: 'none'
    },
    product_type: {
        type: String,
        default: 'none'
    },
    product_year: {
        type: Number,
        default: null
    },
    product_fuel_type: {
        type: String,
        default: 'none'
    },
    product_transmission_type: {
        type: String,
        default: 'none'
    },
    product_no_of_owner: {
        type: String,
        default: 'none'
    },
    product_km_driven: {
        type: Number,
        default: null
    },
    product_for: {
        type: String,
        default: 'none'
    },
    product_door_style: {
        type: String,
        default: 'none'
    },
    product_seller_type: {
        type: String,
        default: 'none'
    }

}, { timestamps: true });

// const sanitizerPlugin = require('mongoose-dompurify');

// productSchema.plugin(sanitizerPlugin, {
//     // Do not sanitize these fields (default: [])
//     skip: [],

//     // Encode HTML entities? (default: false)
//     encodeHtmlEntities: false,

//     // Configure DOMPurify, see https://github.com/cure53/DOMPurify for a list of options (default: undefined)
//     sanitizer: {
//         SAFE_FOR_JQUERY: true,
//         SAFE_FOR_TEMPLATES: true,
//         ALLOWED_TAGS: []
//     }
// });

// module.exports = {
//     model: mongoose.model("Product", productSchema),
//     schema: productSchema
// };

module.exports = mongoose.model('Product', productSchema);
