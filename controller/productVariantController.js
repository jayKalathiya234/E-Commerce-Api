const productVariant = require('../model/productVariantModel')
const mongoose = require('mongoose')

exports.createProductVariant = async (req, res) => {
    try {
        let { productId, sizeNameId, size, unitId, shortDescription, originalPrice, discountPrice, productOfferId, colorName, images, specifications, description, storage, shiping, returnPolicy, manufacturingDetails } = req.body

        // let checkExistProductVariant = await productVariant.findOne({ productId })

        // if (checkExistProductVariant) {
        //     return res.status(409).json({ status: 409, message: "Product Variant Alredy Exist..." })
        // }

        if (typeof productOfferId === 'string') {
            productOfferId = JSON.parse(productOfferId);
        }

        if (Array.isArray(productOfferId)) {
            productOfferId = productOfferId.map(id => new mongoose.Types.ObjectId(id));
        }
        else {
            return res.status(400).json({ status: 400, message: "productOfferId must be an array of ObjectIds" });
        }

        if (!req.files) {
            return res.status(404).json({ status: 404, message: "Image Is Required" });
        }

        const files = req.files['images']

        checkExistProductVariant = await productVariant.create({
            productId,
            sizeNameId,
            unitId,
            shortDescription,
            description,
            productOfferId,
            originalPrice,
            discountPrice,
            specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
            storage,
            size,
            colorName,
            images: files.map(file => file.path),
            shiping,
            returnPolicy,
            manufacturingDetails
        })

        return res.status(200).json({ status: 200, message: "Product Variant Create SuccessFully...", productVariant: checkExistProductVariant });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllProductVariant = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedProductVariant;

        paginatedProductVariant = await productVariant.aggregate([
            {
                $lookup: {
                    from: 'stocks',
                    localField: 'productId',
                    foreignField: 'productId',
                    as: 'stockData'
                }
            }
        ])

        let count = paginatedProductVariant.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Product Variant Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedProductVariant = await paginatedProductVariant.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalProductVariant: count, message: "All Product Variant Found SuccessFully...", productVariant: paginatedProductVariant });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getProductVarinatById = async (req, res) => {
    try {
        let id = req.params.id

        let getProductVariantId = await productVariant.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'stocks',
                    localField: 'productId',
                    foreignField: 'productId',
                    as: 'stockData'
                }
            }
        ])

        if (!getProductVariantId) {
            return res.status(404).json({ status: 404, message: "Product Variant Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Product Variant Found SuccessFully...", productVariant: getProductVariantId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateProductVariantById = async (req, res) => {
    try {
        let id = req.params.id

        let { productId, sizeNameId, size, unitId, shortDescription, originalPrice, discountPrice, productOfferId, colorName, images, specifications, description, storage, shiping, returnPolicy, manufacturingDetails, stockStatus } = req.body

        let updateProductVariantId = await productVariant.findById(id)

        if (!updateProductVariantId) {
            return res.status(404).json({ status: 404, message: "Product Variant Not Found" })
        }

        if (productId !== undefined) updateProductVariantId.productId = productId
        if (sizeNameId !== undefined) updateProductVariantId.sizeNameId = sizeNameId
        if (size !== undefined) updateProductVariantId.size = size
        if (unitId !== undefined) updateProductVariantId.unitId = unitId
        if (shortDescription !== undefined) updateProductVariantId.shortDescription = shortDescription
        if (originalPrice !== undefined) updateProductVariantId.originalPrice = originalPrice
        if (discountPrice !== undefined) updateProductVariantId.discountPrice = discountPrice
        if (productOfferId !== undefined) updateProductVariantId.productOfferId = productOfferId
        if (colorName !== undefined) updateProductVariantId.colorName = colorName
        if (description !== undefined) updateProductVariantId.description = description
        if (storage !== undefined) updateProductVariantId.storage = storage
        if (shiping !== undefined) updateProductVariantId.shiping = shiping
        if (returnPolicy !== undefined) updateProductVariantId.returnPolicy = returnPolicy
        if (manufacturingDetails !== undefined) updateProductVariantId.manufacturingDetails = manufacturingDetails
        if (stockStatus !== undefined) updateProductVariantId.stockStatus = stockStatus

        if (req.files && req.files['images']) {
            const files = req.files['images'];
            updateProductVariantId.images = files.map(file => file.path);
        }

        if (specifications && typeof specifications === 'object') {
            updateProductVariantId.specifications = {
                ...updateProductVariantId.specifications,
                ...specifications
            };
        }

        const updatedProduct = await updateProductVariantId.save();

        return res.status(200).json({ status: 200, message: "Product Variant Updated SuccessFully...", productVariant: updatedProduct });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteProducVariant = async (req, res) => {
    try {
        let id = req.params.id

        let deleteProductVariant = await productVariant.findById(id)

        if (!deleteProductVariant) {
            return res.status(404).json({ status: 404, message: "Product Varint Not Found" })
        }

        await productVariant.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Product Varint Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateProductStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let { stockStatus } = req.body

        let updateProductStatusId = await productVariant.findById(id)

        if (!updateProductStatusId) {
            return res.status(404).json({ status: 404, message: "Product Variant Not Found" })
        }

        updateProductStatusId = await productVariant.findByIdAndUpdate(id, { stockStatus }, { new: true })

        return res.status(200).json({ status: 200, message: "Stock Status Updated SuccessFully...", productVariant: updateProductStatusId })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}