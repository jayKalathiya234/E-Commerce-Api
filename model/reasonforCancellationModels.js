const mongoose = require('mongoose')

const cancellationSchema = mongoose.Schema({
    reasonName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('reasonofcancellation', cancellationSchema)