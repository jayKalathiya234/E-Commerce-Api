const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    name: {
        type: String,
        require: true
    },
    contactNo: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    landmark: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        require: true
    }
}, {
    timestamps: true, 
    versionKey: false
});

module.exports = mongoose.model('address', addressSchema);