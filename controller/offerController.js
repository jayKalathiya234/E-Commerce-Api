const offers = require('../model/offerModel')
const mongoose = require('mongoose')

exports.createOffer = async (req, res) => {
    try {
        let { mainCategoryId, categoryId, subCategoryId, offerType, offerName, offerImage, buttonText, startDate, endDate, description } = req.body

        let checkOfferIsExist;
        //  checkOfferIsExist = await offers.findOne({ offerType, offerName })

        // if (checkOfferIsExist) {
        //     return res.status(409).json({ status: 409, message: "Offer Is Alredy Exist..." })
        // }

        if (!req.file) {
            return res.status(400).json({ status: 400, message: "OfferImage Is Required" })
        }

        checkOfferIsExist = await offers.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            offerType,
            offerName,
            offerImage: req.file.path,
            buttonText,
            startDate,
            endDate,
            description
        })

        return res.status(201).json({ status: 201, message: "Offer Created SuccessFully...", offer: checkOfferIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllOffers = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedOffers;

        paginatedOffers = await offers.aggregate([
            {
                $lookup: {
                    from: "maincategories",
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoriesData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: "_id",
                    as: 'categoriesData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategoryId',
                    foreignField: "_id",
                    as: 'subCategoriesData'
                }
            },
        ]);

        let count = paginatedOffers.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Offers Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedOffers = await paginatedOffers.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUsers: count, message: "All Offers Found SuccessFully....", offers: paginatedOffers })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getOffersById = async (req, res) => {
    try {
        let id = req.params.id

        let getOfferId = await offers.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "maincategories",
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoriesData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: "_id",
                    as: 'categoriesData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategoryId',
                    foreignField: "_id",
                    as: 'subCategoriesData'
                }
            },
        ])

        if (!getOfferId) {
            return res.status(404).json({ status: 404, message: "Offer Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Offer Found SuccessFully...", offer: getOfferId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let updateOfferId = await offers.findById(id)

        if (!updateOfferId) {
            return res.status(404).json({ status: 404, message: "Offer Not Found" })
        }

        if (req.file) {
            req.body.offerImage = req.file.path
        }

        updateOfferId = await offers.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Offer Updated SuccessFully...", offers: updateOfferId })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteOfferId = await offers.findById(id)

        if (!deleteOfferId) {
            return res.status(404).json({ status: 404, message: "Offer Not Found" })
        }

        await offers.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Offer Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}