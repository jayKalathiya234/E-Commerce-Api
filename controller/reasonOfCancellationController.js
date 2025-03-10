const reason = require('../model/reasonforCancellationModels')

exports.createReason = async (req, res) => {
    try {
        let { reasonName } = req.body

        let checkReasonIsExist = await reason.findOne({ reasonName })

        if (checkReasonIsExist) {
            return res.status(409).json({ status: 409, message: "Reason already exist" })
        }

        checkReasonIsExist = await reason.create({
            reasonName
        });

        return res.status(201).json({ status: 201, message: "Reason Create SuccessFully...", reason: checkReasonIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllReason = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedReason;

        paginatedReason = await reason.find()

        let count = paginatedReason.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Reason Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedReason = await paginatedReason.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalResonsForCancellation: count, message: "All Reasons Found SuccessFully...", reasons: paginatedReason })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getReasonById = async (req, res) => {
    try {
        let id = req.params.id

        let getReasonId = await reason.findById(id)

        if (!getReasonId) {
            return res.status(404).json({ status: 404, message: "Reason Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Reason Found SuccessFully...", reason: getReasonId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateReasonById = async (req, res) => {
    try {
        let id = req.params.id

        let updateReasonId = await reason.findById(id)

        if (!updateReasonId) {
            return res.status(404).json({ status: 404, message: "Reason Not Found" })
        }

        updateReasonId = await reason.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Reason Update SuccessFully...", reason: updateReasonId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteReasonById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteReasonId = await reason.findById(id)

        if (!deleteReasonId) {
            return res.status(404).json({ status: 404, message: "Reason Not Found" })
        }

        await reason.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Reason Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}