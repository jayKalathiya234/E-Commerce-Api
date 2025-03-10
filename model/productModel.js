const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainCategory',
        require: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        require: true
    },
    productName: {
        type: String,
        require: true
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out Of Stock', 'Low Stock'],
        default: 'In Stock'
    },
    quantity: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('product', productSchema);