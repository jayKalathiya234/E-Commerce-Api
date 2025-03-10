const mongoose = require('mongoose')

const popularBandSchema = mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    offer: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    brandLogo: {
        type: String,
        required: true
    },
    brandImage: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('popularbrands', popularBandSchema)