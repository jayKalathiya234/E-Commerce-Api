const mongoose = require('mongoose')

const returnOrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        require: true
    },
    reasonForReturn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reasonofcancellation',
        require: true
    },
    mobileNo: {
        type: String,
        require: true
    },
    otp: {
        type: Number,
        require: true
    },
    returnOrderStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('returnOrder', returnOrderSchema)