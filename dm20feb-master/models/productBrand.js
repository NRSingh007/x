const mongoose = require('mongoose');
const { Timestamp } = require('mongodb');
const Schema = mongoose.Schema;

const productBrandSchema = new Schema({
    brand_name: {
        type: String,
        required: true,
        trim: true
    },
    product_subcategory: {
        type: String,
        required: true,
        trim: true
    },

}, { timestamps: true }
);

module.exports = mongoose.model('ProductBrand', productBrandSchema);