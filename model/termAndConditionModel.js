const mongoose = require('mongoose')

const termsAndConditionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('termsandconditions', termsAndConditionSchema)