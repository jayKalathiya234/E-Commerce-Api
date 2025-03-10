const mongoose = require('mongoose')

const productOfferSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mainCategory',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        require: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategories',
        require: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        require: true
    },
    offerName: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    discountPrice: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    startDate: {
        type: String,
        require: true
    },
    endDate: {
        type: String,
        require: true
    },
    minimumPurchase: {
        type: String,
        require: true
    },
    maximumPurchase: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('productOffer', productOfferSchema)

