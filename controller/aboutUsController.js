const aboutUs = require('../model/aboutUsModel');

exports.createAboutUs = async (req, res) => {
    try {
        let { title, description, aboutUsImage } = req.body

        let checkTitleIsExist = await aboutUs.findOne({ title })

        if (checkTitleIsExist) {
            return res.status(409).json({ status: 409, message: "Title Already Exist..." })
        }

        if (!req.file) {
            return res.status(403).json({ status: 403, message: "aboutUsImage File Is Required" })
        }

        checkTitleIsExist = await aboutUs.create({
            title,
            description,
            aboutUsImage: req.file.path
        })

        return res.status(201).json({ status: 201, message: "Title Create SuccessFully...", aboutUs: checkTitleIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllAboutUs = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedAboutUs;

        paginatedAboutUs = await aboutUs.find()

        let count = paginatedAboutUs.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "AboutUs Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAboutUs = await paginatedAboutUs.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalAboutUs: count, message: "All About Us Found SuccessFully....", aboutUs: paginatedAboutUs })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAboutUsById = async (req, res) => {
    try {
        let id = req.params.id

        let getAboutUsId = await aboutUs.findById(id)

        if (!getAboutUsId) {
            return res.status(404).json({ status: 404, message: "AboutUs Not Found" })
        }

        return res.status(200).json({ status: 200, message: "AboutUs Found SuccessFully...", aboutUs: getAboutUsId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateAboutUsById = async (req, res) => {
    try {
        let id = req.params.id

        let updateAboutUsId = await aboutUs.findById(id)

        if (!updateAboutUsId) {
            return res.status(404).json({ status: 404, message: "AboutUs Not Found" })
        }

        if (req.file) {
            req.body.aboutUsImage = req.file.path
        }

        updateAboutUsId = await aboutUs.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "About Us Updated SuccessFully...", aboutUs: updateAboutUsId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteAboutUsById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteAboutUsId = await aboutUs.findById(id)

        if (!deleteAboutUsId) {
            return res.status(404).json({ status: 404, message: "About Us Not Found" })
        }

        await aboutUs.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "AboutUs Deleted SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}