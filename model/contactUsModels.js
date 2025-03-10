const mongoose = require('mongoose')

const contactUsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        enum: ['General Inquiry', 'Payment related', 'Product related'],
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('contactus', contactUsSchema);
