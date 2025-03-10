const mongoose = require('mongoose')

const specialOfferSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    coupenType: {
        type: String,
        enum: ['Fixed', 'Percentage'],
        require: true
    },
    offerDiscount: {
        type: String,
        require: true
    },
    startDate: {
        type: String,
        require: true
    },
    endDate: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('specialoffers', specialOfferSchema);