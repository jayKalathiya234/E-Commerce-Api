const mongoose = require('mongoose')

const helpSchema = mongoose.Schema({
    helpQuestion: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('helps', helpSchema)