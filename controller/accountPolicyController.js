const accountpolicy = require('../model/accountPolicyModel')

exports.createAccountPolicy = async (req, res) => {
    try {
        let { policyName } = req.body

        let checkExistPolicyName = await accountpolicy.findOne({ policyName })

        if (checkExistPolicyName) {
            return res.status(409).json({ status: 409, message: "Policy Name Already Exist..." })
        }

        checkExistPolicyName = await accountpolicy.create({
            policyName
        });

        return res.status(201).json({ status: 201, message: "Policy Create SuccessFully...", accountpolicy: checkExistPolicyName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllAccountPolicy = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedAccountPolicy;

        paginatedAccountPolicy = await accountpolicy.find()

        let count = paginatedAccountPolicy.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Account Policy Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAccountPolicy = await paginatedAccountPolicy.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalPolicy: count, message: "All Account Policy Found SuccessFully...", accountpolicy: paginatedAccountPolicy })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAccountPolicyById = async (req, res) => {
    try {
        let id = req.params.id

        let getPolicyId = await accountpolicy.findById(id)

        if (!getPolicyId) {
            return res.status(404).json({ status: 404, message: "Account Policy Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Account Policy Found SuccessFully...", accountPolicy: getPolicyId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateAcountPolicy = async (req, res) => {
    try {
        let id = req.params.id

        let updatePolicyId = await accountpolicy.findById(id)

        if (!updatePolicyId) {
            return res.status(404).json({ status: 404, message: "Account Policy Not Found" })
        }

        updatePolicyId = await accountpolicy.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Account Policy Updated SuccessFully...", accountpolicy: updatePolicyId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteAccountPolicy = async (req, res) => {
    try {
        let id = req.params.id

        let deletePolicyId = await accountpolicy.findById(id)

        if (!deletePolicyId) {
            return res.status(404).json({ status: 404, message: "Account Policy Not Found" })
        }

        await accountpolicy.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: 'Account Policy Delete SuccessFully...' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
