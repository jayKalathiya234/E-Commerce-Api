const paymentMethod = require('../model/paymentMethodModel');

exports.createPaymentMethod = async (req, res) => {
    try {
        let { type, cardHolderName, cardNo, cvv, expiryDate, upiId } = req.body

        if (type === "addCredit/DebitCard") {
            let checkExistCardData = await paymentMethod.findOne({ userId: req.user._id, cardHolderName, cardNo })

            if (checkExistCardData) {
                return res.status(400).json({ status: 400, message: "Card Data Already Exists..." })
            }

            checkExistCardData = await paymentMethod.create({
                userId: req.user._id,
                type,
                cardHolderName,
                cardNo,
                cvv,
                expiryDate
            })

            return res.status(201).json({ status: 201, message: "Card Created SuccessFully...", card: checkExistCardData })
        }

        if (type === "add UPI ID") {
            let checkExistUpiId = await paymentMethod.findOne({ userId: req.user._id, upiId })

            if (checkExistUpiId) {
                return res.status(400).json({ status: 400, message: "UPI ID Already Exist..." })
            }

            checkExistUpiId = await paymentMethod.create({
                userId: req.user._id,
                type,
                upiId
            });

            return res.status(201).json({ status: 201, message: "UPI ID Created SuccessFully...", upi: checkExistUpiId })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCardData = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page and PageSize Cann't Be Less Than 1" })
        }

        let paginatedCardData;

        paginatedCardData = await paymentMethod.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            }
        ])

        let count = paginatedCardData.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Payment Method Data Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCardData = await paginatedCardData.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalCardData: count, message: "All Payment Method Found SuccessFully...", paymentMethod: paginatedCardData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllMyPaymentData = async (req, res) => {
    try {
        let type = req.query.type

        let getAllMyPaymentData = await paymentMethod.find({ userId: req.user._id, type: type })

        if (!getAllMyPaymentData) {
            return res.status(404).json({ status: 404, message: "Payment Data Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Payment Method Data Found SuccessFully...", paymentMethod: getAllMyPaymentData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updatePaymentdataById = async (req, res) => {
    try {
        let id = req.params.id

        let updatePaymentId = await paymentMethod.findById(id)

        if (!updatePaymentId) {
            return res.status(404).json({ status: 404, message: "Payment Data Not Found" })
        }

        updatePaymentId = await paymentMethod.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Payment Data Update SuccessFully...", paymentMethod: updatePaymentId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deletePaymentDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deletePaymentDataId = await paymentMethod.findById(id)

        if (!deletePaymentDataId) {
            return res.status(404).json({ status: 404, message: "Payment Data Not Found" })
        }

        await paymentMethod.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Payment Data Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}