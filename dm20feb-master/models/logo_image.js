const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logoImageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    file_id: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('LogoImage', logoImageSchema);