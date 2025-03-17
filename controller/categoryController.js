const category = require('../model/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        let { mainCategoryId, categoryName } = req.body

        let checkExistCategoryName = await category.findOne({ mainCategoryId, categoryName })

        if (checkExistCategoryName) {
            return res.status(409).json({ status: 409, message: "Category Alredy Exist..." })
        }

        checkExistCategoryName = await category.create({
            mainCategoryId,
            categoryName,
            categoryImage: req.file.path
        });

        return res.status(201).json({ status: 201, message: "Category Create SuccessFully...", category: checkExistCategoryName });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCategory;

        paginatedCategory = await category.aggregate([
            {
                $lookup: {
                    from: "maincategories",
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            }
        ])

        let count = paginatedCategory.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCategory = await paginatedCategory.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalCategory: count, message: "All Category Found SuccessFully...", category: paginatedCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let getCategoryId = await category.findById(id)

        if (!getCategoryId) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Category Found SuccessFully...", category: getCategoryId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCategoryId = await category.findById(id)

        if (!updateCategoryId) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        if (req.body.categoryImage) {
            req.body.categoryImage = req.file.path
        }
        
        updateCategoryId = await category.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Category Updated SuccessFully...", category: updateCategoryId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCategoryId = await category.findById(id)

        if (!deleteCategoryId) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        await category.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Category Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}