const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerTextSchema = new Schema({
    banner_text: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('BannerText', bannerTextSchema);