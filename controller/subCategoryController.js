const subCategory = require('../model/subCategoryModel');

exports.createSubCategory = async (req, res) => {
    try {
        let { mainCategoryId, categoryId, subCategoryName } = req.body

        let existSubCategory = await subCategory.findOne({ mainCategoryId, categoryId, subCategoryName })

        if (existSubCategory) {
            return res.status(409).json({ status: 409, message: "Sub Category Alredy Exist" })
        }

        existSubCategory = await subCategory.create({
            mainCategoryId,
            categoryId,
            subCategoryName
        });

        return res.status(201).json({ status: 201, message: "subCategory Create SuccessFully...", subCategory: existSubCategory });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSubCategory = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedSubCategory;

        paginatedSubCategory = await subCategory.aggregate([
            {
                $lookup: {
                    from: "maincategories",
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoriesData"
                }
            }
        ])
        
        let count = paginatedSubCategory.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Sub Category Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedSubCategory = await paginatedSubCategory.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalSubCategory: count, message: "All SubCategory Found SuccessFully...", subCategory: paginatedSubCategory });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let getSubCategoryId = await subCategory.findById(id)

        if (!getSubCategoryId) {
            return res.status(404).json({ status: 404, message: "Sub Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "SubCategory Found SuccessFully...", subCategory: getSubCategoryId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCategoryId = await subCategory.findById(id)

        if (!updateCategoryId) {
            return res.status(404).json({ status: 404, message: "SubCategory Not Found" })
        }

        updateCategoryId = await subCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "subCategoy Updated SuccessFully...", subCategory: updateCategoryId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCategoryId = await subCategory.findById(id)

        if (!deleteCategoryId) {
            return res.status(404).json({ status: 404, message: "SubCategory Not Found" })
        }

        await subCategory.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "subCategory Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}