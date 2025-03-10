const mongoose = require('mongoose')

const wishListSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('wishlist', wishListSchema);