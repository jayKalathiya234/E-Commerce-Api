const stock = require('../model/stockModle')
const product = require('../model/productModel');

exports.createStock = async (req, res) => {
    try {
        let { mainCategoryId, categoryId, subCategoryId, productId, stockStatus, quantity } = req.body

        let checkStockDataIsExist = await stock.findOne({ productId })

        if (checkStockDataIsExist) {
            return res.status(409).json({ status: 409, message: "Stock Alredy Exist" })
        }

        checkStockDataIsExist = await stock.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            productId,
            stockStatus,
            quantity
        });

        let getProductVarientData = await product.findById(productId)

        if (!getProductVarientData) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        getProductVarientData.quantity = quantity

        await getProductVarientData.save();

        return res.status(201).json({ status: 201, message: "Stock Created SuccessFully...", stock: checkStockDataIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllStockReport = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedStock;

        paginatedStock = await stock.aggregate([
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
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                }
            }
        ])

        let count = paginatedStock.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Stock Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedStock = await paginatedStock.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, allStocks: count, message: "All Stock Reports Found SuccessFully...", stock: paginatedStock })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getStockDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getStockDataId = await stock.findById(id)

        if (!getStockDataId) {
            return res.status(404).json({ status: 404, message: "Stock Data Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Stock Data Found SuccessFully...", stock: getStockDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateStockDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateStockDataId = await stock.findById(id)

        if (!updateStockDataId) {
            return res.status(404).json({ status: 404, message: "Stock Data Not Found" })
        }

        if (req.body.quantity) {
            let getProductVarientData = await product.findById(updateStockDataId.productId)

            if (!getProductVarientData) {
                return res.status(404).json({ status: 404, message: "Product Not Found" })
            }

            getProductVarientData.quantity = req.body.quantity

            await getProductVarientData.save();
        }
        updateStockDataId = await stock.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Stock Data Updated SuccessFully...", stock: updateStockDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteStockDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteStockId = await stock.findById(id)

        if (!deleteStockId) {
            return res.status(404).json({ status: 404, message: "Stock Data Not Found" })
        }

        await stock.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Stock Data Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.statsu(500).json({ status: 500, message: error.message })
    }
}