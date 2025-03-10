const termsandconditions = require('../model/termAndConditionModel')

exports.createTermsAndConditions = async (req, res) => {
    try {
        let { title, description } = req.body

        let checkTitleIsExist = await termsandconditions.findOne({ title: title })

        if (checkTitleIsExist) {
            return res.status(409).json({ status: 409, message: "Title Already Exist..." })
        }

        checkTitleIsExist = await termsandconditions.create({
            title,
            description
        })

        return res.status(201).json({ status: 201, message: "Terms And Condition Create SuccessFully...", termsandconditions: checkTitleIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllTermsAndConditions = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedTermsAndConditions;

        paginatedTermsAndConditions = await termsandconditions.find()

        let count = paginatedTermsAndConditions.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Terms Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + lastIndex)
            paginatedTermsAndConditions = await paginatedTermsAndConditions.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalTerms: count, message: "All Terms Found SuccessFully...", terms: paginatedTermsAndConditions })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getTermsAndConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let getTermsData = await termsandconditions.findById(id)

        if (!getTermsData) {
            return res.status(404).json({ status: 404, message: "Term Data Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Terms Data Found SuccessFully...", term: getTermsData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateTermsAndConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let updateTermsData = await termsandconditions.findById(id)

        if (!updateTermsData) {
            return res.status(404).json({ status: 404, message: "Term Data Not Found" })
        }

        updateTermsData = await termsandconditions.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Term Data Updated SuccessFully...", term: updateTermsData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteTermsAndConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteTermsData = await termsandconditions.findById(id)

        if (!deleteTermsData) {
            return res.status(404).json({ status: 404, message: "Term Data Not Found" })
        }

        await termsandconditions.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Term Data Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}