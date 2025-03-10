const mongoose = require('mongoose')

const stockSchema = mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories',
        require: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        require: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategories',
        require: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
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
})

module.exports = mongoose.model('stock', stockSchema)