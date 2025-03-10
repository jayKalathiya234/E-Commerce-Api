const mongoose = require('mongoose')

const accountPolicySchema = mongoose.Schema({
    policyName: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('accountpolicys', accountPolicySchema)