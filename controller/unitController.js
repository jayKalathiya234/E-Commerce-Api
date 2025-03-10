const unit = require('../model/unitModel')

exports.createUnit = async (req, res) => {
    try {
        let { name, shortName } = req.body

        let checkUnitNameIsExist = await unit.findOne({ name })

        if (checkUnitNameIsExist) {
            return res.status(409).json({ status: 409, message: "Unit Name Already Exist.." })
        }

        checkUnitNameIsExist = await unit.create({
            name,
            shortName
        })

        return res.status(201).json({ status: 201, message: "unitName Create SuccessFully...", unit: checkUnitNameIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ statsu: 500, message: error.message })
    }
}

exports.getAllUnit = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedUnit;

        paginatedUnit = await unit.find()

        let count = paginatedUnit.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Unit Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedUnit = await paginatedUnit.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUnits: count, message: "All Unit Found SuccessFully...", unit: paginatedUnit })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getUnitDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getUnitDataId = await unit.findById(id)

        if (!getUnitDataId) {
            return res.status(404).json({ status: 404, message: "Unit Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Unit Data Found SuccessFully...", unit: getUnitDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateUnitDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateUnitDataId = await unit.findById(id)

        if (!updateUnitDataId) {
            return res.status(404).json({ status: 404, message: "Unit Not Found" })
        }

        updateUnitDataId = await unit.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Unit Data Updated SuccessFully...", unit: updateUnitDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteUnitDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUnitDataId = await unit.findById(id)

        if (!deleteUnitDataId) {
            return res.status(404).json({ status: 404, message: 'Unit Not Found' })
        }

        await unit.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Unit Data Delete SuccessFully..." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}