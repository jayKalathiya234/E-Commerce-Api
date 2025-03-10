const mongoose = require('mongoose')
const productOffer = require('../model/productOfferModel')

exports.createProductOffer = async (req, res) => {
    try {
        let { mainCategoryId, categoryId, subCategoryId, productId, offerName, code, discountPrice, price, startDate, endDate, minimumPurchase, maximumPurchase, description } = req.body

        let checkProductOfferIsExist = await productOffer.findOne({ code })

        if (checkProductOfferIsExist) {
            return res.status(409).json({ status: 409, message: "Code Is Already Exist..." })
        }

        checkProductOfferIsExist = await productOffer.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            productId,
            offerName,
            code,
            discountPrice,
            price,
            startDate,
            endDate,
            minimumPurchase,
            maximumPurchase,
            description
        });

        return res.status(200).json({ status: 200, message: "Product Offer Create SuccessFully...", productOffer: checkProductOfferIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllProductOffer = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(404).json({ status: 404, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedProductOffer;

        paginatedProductOffer = await productOffer.aggregate([
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
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: "_id",
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productData._id',
                    foreignField: 'productId',
                    as: "productVariantData"
                }
            }
        ])

        let count = paginatedProductOffer.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Product Offer Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedProductOffer = await paginatedProductOffer.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalProductOffers: count, message: "All Product Offer Found SuccessFully...", productOffer: paginatedProductOffer })

    } catch (error) {
        console(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getProductOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let getProductOfferId = await productOffer.aggregate([
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
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: "_id",
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productData._id',
                    foreignField: 'productId',
                    as: "productVariantData"
                }
            }
        ])

        if (!getProductOfferId) {
            return res.status(404).json({ status: 404, message: "Produc Offer Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Product Offer Found SuccessFully...", productOffer: getProductOfferId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateProductOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let updateProductOfferId = await productOffer.findById(id)

        if (!updateProductOfferId) {
            return res.status(404).json({ status: 404, message: "Product Offer Not Found" })
        }

        updateProductOfferId = await productOffer.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Product Offer Found SuccessFully...", productOffer: updateProductOfferId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteProductOfferById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteProductOfferId = await productOffer.findById(id)

        if (!deleteProductOfferId) {
            return res.status(404).json({ status: 404, message: "Product Offer Not Found" })
        }

        await productOffer.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Product Offer Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

