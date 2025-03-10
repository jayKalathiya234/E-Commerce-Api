const mongoose = require('mongoose')

const unitSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    shortName: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('units', unitSchema)