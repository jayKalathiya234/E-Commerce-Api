const mongoose = require('mongoose')

const offerSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mainCategory',
        require: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        require: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        require: true
    },
    offerType: {
        type: String,
        require: true
    },
    offerName: {
        type: String,
        require: true
    },
    offerImage: {
        type: String,
        require: true
    },
    buttonText: {
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
    description: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('offers', offerSchema)