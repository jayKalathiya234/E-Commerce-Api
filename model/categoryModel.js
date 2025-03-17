const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mainCategory',
        require: true
    },
    categoryName: {
        type: String,
        require: true
    },
    categoryImage: {
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

module.exports = mongoose.model('category', categorySchema); 