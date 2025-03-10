const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        require: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                require: true
            },
            productVariantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productvariant',
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ],
    deliveryType: {
        type: String,
        enum: ["Express", "Standard", "Free"],
        require: true
    },
    coupenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specialoffers',
        require: true
    },
    productOfferId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productoffer',
        require: true
    },
    totalAmount: {
        type: Number,
        require: true
    },
    orderStatus: {
        type: String,
        enum: ['Confirmed', 'Shipped', 'outForDelivery', 'Delivered','Cancelled'],
        default: 'Confirmed',
        require: true
    },
    paymentMethod: {
        type: String,
        enum: ['received', 'notReceived'],
        require: true
    },
    isReturn: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('order', orderSchema);