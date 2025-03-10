const mongoose = require('mongoose')

const sizeSchema = mongoose.Schema({
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainCategory',
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
    sizeName: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        require: true,
        default: '-'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('sizes', sizeSchema)
