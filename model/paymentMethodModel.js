const mongoose = require('mongoose')

const paymentMethodSchema = mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    cardHolderName: {
        type: String,
        require: true
    },
    cardNo: {
        type: String,
        require: true
    },
    cvv: {
        type: String,
        require: true
    },
    expiryDate: {
        type: String,
        require: true
    },
    upiId: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('paymentmethods', paymentMethodSchema)