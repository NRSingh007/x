const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerImageSchema = new Schema({
    image_title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    file_id: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('BannerImage', bannerImageSchema);