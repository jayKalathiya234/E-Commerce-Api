const mongoose = require('mongoose')

const productVariantSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        require: true
    },
    sizeNameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'size',
        require: true
    },
    size: {
        type: String,
        require: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'unit',
        require: true
    },
    shortDescription: {
        type: String,
        require: true
    },
    originalPrice: {
        type: String,
        require: true
    },
    discountPrice: {
        type: String,
        require: true
    },
    productOfferId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productOffer',
        require: true
    }],
    colorName: {
        type: String,
        require: true
    },
    images: [{
        type: String,
        require: true
    }],
    specifications: {
        type: mongoose.Schema.Types.Mixed
    },
    description: {
        type: String,
        require: true
    },
    shiping: {
        type: String,
        require: true
    },
    manufacturingDetails: {
        type: String,
        require: true
    },
    returnPolicy: {
        type: String,
        require: true
    },
    stockStatus: {
        type: String,
        enum: ["true", 'false'],
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('productvariant', productVariantSchema)