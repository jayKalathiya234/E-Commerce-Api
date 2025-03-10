const mongoose = require('mongoose')
const sizes = require('../model/sizeModel')

exports.createSize = async (req, res) => {
    try {
        let { mainCategory, categoryId, subCategoryId, sizeName, size, unit } = req.body

        let checkSizeNameIsExist = await sizes.findOne({ mainCategory, categoryId, subCategoryId, sizeName })

        if (checkSizeNameIsExist) {
            return res.status(409).json({ status: 409, message: "Size Name Alredy Exist.." })
        }

        checkSizeNameIsExist = await sizes.create({
            mainCategory,
            categoryId,
            subCategoryId,
            sizeName,
            size,
            unit
        });

        return res.status(201).json({ status: 201, message: "Size Name Create SuccessFully...", size: checkSizeNameIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSizes = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedSize;

        paginatedSize = await sizes.aggregate([
            {
                $lookup: {
                    from: 'maincategories',
                    localField: "mainCategory",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'units',
                    localField: "unit",
                    foreignField: "_id",
                    as: "unitData"
                }
            }
        ])

        let count = paginatedSize.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Size Data Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedSize = await paginatedSize.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalSizes: count, message: "All Size Data Found SuccessFully...", sizes: paginatedSize })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSizeDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getSizeDataId = await sizes.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: "mainCategory",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            }
        ])

        return res.status(200).json({ status: 200, message: "Size Data Found SuccessFully...", size: getSizeDataId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSizeDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateSizeDataId = await sizes.findById(id)

        if (!updateSizeDataId) {
            return res.status(404).json({ status: 404, message: "Size Data Not Found" })
        }

        updateSizeDataId = await sizes.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "size Data Updated SuccessFully...", size: updateSizeDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteSizeDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteSizeDataId = await sizes.findById(id)

        if (!deleteSizeDataId) {
            return res.status(404).json({ status: 404, message: "size Data Not Found" })
        }

        await sizes.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Size Data Deleted SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
