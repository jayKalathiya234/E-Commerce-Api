const specialOffer = require('../model/specialOfferModel')

exports.createSpecialOffer = async (req, res) => {
    try {
        let { code, title, description, coupenType, offerDiscount, startDate, endDate } = req.body

        let existSpecialOffer = await specialOffer.findOne({ title })

        if (existSpecialOffer) {
            return res.status(400).json({ status: 400, message: "Special Offer already exist..." })
        }

        existSpecialOffer = await specialOffer.create({
            code,
            title,
            description,
            coupenType,
            offerDiscount,
            startDate,
            endDate
        });

        return res.status(201).json({ status: 201, message: "special Offer Create SuccessFully...", specialOffer: existSpecialOffer });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSpecialOffer = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedSpecialOffer;

        paginatedSpecialOffer = await specialOffer.find()

        let count = paginatedSpecialOffer.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Special Offer Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedSpecialOffer = await paginatedSpecialOffer.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalSpecialOffer: count, message: "All Special Offer Found SuccessFully...", specialOffers: paginatedSpecialOffer });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSpecialOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let getSpecialOfferId = await specialOffer.findById(id)

        if (!getSpecialOfferId) {
            return res.status(404).json({ status: 404, message: "Special Offer Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Special Offer Found SuccessFully...", specialOffer: getSpecialOfferId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSpecialOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let updateSpecialOfferId = await specialOffer.findById(id)

        if (!updateSpecialOfferId) {
            return res.status(404).json({ status: 404, message: "Special Offer Not Found" })
        }

        updateSpecialOfferId = await specialOffer.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Special Offer Updated SuccessFully...", specialOffer: updateSpecialOfferId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteSpecialOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteSpecialOfferId = await specialOffer.findById(id)

        if (!deleteSpecialOfferId) {
            return res.status(404).json({ status: 404, message: "Special Offer Not Found" })
        }

        await specialOffer.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Special offer Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}