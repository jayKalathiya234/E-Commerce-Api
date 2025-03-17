const mainCategory = require('../model/maincategoryModel')

exports.createMainCategory = async (req, res) => {
    try {
        let { mainCategoryName, mainCategoryImage } = req.body

        let checkExistCategoryName = await mainCategory.findOne({ mainCategoryName })

        if (checkExistCategoryName) {
            return res.status(409).json({ status: 409, message: "Main Category Name Is Alredy Exist" })
        }

        checkExistCategoryName = await mainCategory.create({
            mainCategoryName,
            mainCategoryImage: req.file.path
        });

        return res.status(201).json({ status: 201, message: "Main Category Create SuccessFully...", maincategory: checkExistCategoryName });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllMainCategory = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedMainCategory;

        paginatedMainCategory = await mainCategory.find()

        let count = paginatedMainCategory.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Main Category Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedMainCategory = await paginatedMainCategory.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalMainCategory: count, message: "All Main Category Found SuccessFully....", users: paginatedMainCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getMainCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let getMainCategoryId = await mainCategory.findById(id)

        if (!getMainCategoryId) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Main Category Found SuccessFully...", mainCategory: getMainCategoryId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateMainCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let updateMainCategoryId = await mainCategory.findById(id)

        if (!updateMainCategoryId) {
            return res.status(404).json({ status: 404, message: "Main Category Not Found" })
        }

        if (req.body.mainCategoryImage) {
            req.body.mainCategoryImage = req.file.path
        }

        updateMainCategoryId = await mainCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Main Category Updated SuccessFully...", mainCategory: updateMainCategoryId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteMainCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteMainCategoryId = await mainCategory.findById(id)

        if (!deleteMainCategoryId) {
            return res.status(404).json({ status: 404, message: "Main Category Not Found" })
        }

        await mainCategory.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Main Category Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}