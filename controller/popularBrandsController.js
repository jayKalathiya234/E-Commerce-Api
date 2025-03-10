const popularBrands = require('../model/popularBrandModel');

exports.createPopularBrands = async (req, res) => {
    try {
        let { brandName, offer, title, brandLogo, brandImage } = req.body

        let checkExistBrandName = await popularBrands.findOne({ brandName })

        // if (checkExistBrandName) {
        //     return res.status(409).json({ status: 409, message: "Brand Name Already Exist..." })
        // }

        if (!req.files) {
            return res.status(404).json({ status: 404, message: "brandLogo & brandImage File Is Required" })
        }

        checkExistBrandName = await popularBrands.create({
            brandName,
            offer,
            title,
            brandLogo: req.files['brandLogo'][0].path,
            brandImage: req.files['brandImage'][0].path
        });

        return res.status(201).json({ status: 201, message: "PopularBrand Create SuccessFully...", popularBrands: checkExistBrandName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllPopularBrands = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedPopularBarnds;

        paginatedPopularBarnds = await popularBrands.find()

        let count = paginatedPopularBarnds.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Popular Brand Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedPopularBarnds = paginatedPopularBarnds.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalPopularBrands: count, message: "All Popular Brands Found SuccessFully...", popularBrand: paginatedPopularBarnds });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getBrandById = async (req, res) => {
    try {
        let id = req.params.id

        let getBrandById = await popularBrands.findById(id)

        if (!getBrandById) {
            return res.status(404).json({ status: 404, message: "Popular Brand Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Popular Brand Found SuccessFully...", popularBrands: getBrandById })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateBrandById = async (req, res) => {
    try {
        let id = req.params.id

        let updateBrandId = await popularBrands.findById(id)

        if (!updateBrandId) {
            return res.status(404).json({ status: 404, message: "Popular Brand Not Found" })
        }

        if (req.files.brandLogo) {
            req.body.brandLogo = req.files['brandLogo'][0].path
        }

        if (req.files.brandImage) {
            req.body.brandImage = req.files['brandImage'][0].path
        }

        updateBrandId = await popularBrands.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Popular Brand Updated SuccessFully...", popularBrands: updateBrandId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deletePopularBrandById = async (req, res) => {
    try {
        let id = req.params.id

        let deletePopularBrandId = await popularBrands.findById(id)

        if (!deletePopularBrandId) {
            return res.status(404).json({ status: 404, message: "Popular Brand Not Found" })
        }

        await popularBrands.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Popular Brand Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
