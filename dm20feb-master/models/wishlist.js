const { types } = require('image-size');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Wishlist", wishlistSchema);