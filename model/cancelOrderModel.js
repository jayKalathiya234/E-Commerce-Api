const mongoose = require('mongoose')

const cancelOrderSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    reasonForCancellationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reasonForCancellation',
        required: true
    },
    comments: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('cancelOrder', cancelOrderSchema)