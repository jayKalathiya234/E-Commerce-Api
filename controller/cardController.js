const card = require('../model/cardModel')

exports.createCard = async (req, res) => {
    try {
        let { title, subTitle, cardImage } = req.body

        let checkTitleIsExist = await card.findOne({ title })

        if (checkTitleIsExist) {
            return res.status(409).json({ status: 409, message: "Title Is Already Exist..." })
        }

        if (!req.file) {
            return res.status(404).json({ status: 404, message: "Card Image Filed Is Required" })
        }

        checkTitleIsExist = await card.create({
            title,
            subTitle,
            cardImage: req.file.path
        })

        return res.status(201).json({ status: 201, message: "Card Title Create SuccessFully...", card: checkTitleIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCardTitles = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCard;

        paginatedCard = await card.find()

        let count = paginatedCard.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Card Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCard = await paginatedCard.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalCards: count, message: "All Card Data Found SuccessFully...", card: paginatedCard })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getCardTitleById = async (req, res) => {
    try {
        let id = req.params.id

        let getCardTitleId = await card.findById(id)

        if (!getCardTitleId) {
            return res.status(404).json({ status: 404, message: "Card Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Card Data Found SuccessFully...", card: getCardTitleId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateCardTitleById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCardId = await card.findById(id)

        if (!updateCardId) {
            return res.status(404).json({ status: 404, message: "Card Not Found" })
        }

        if (req.file) {
            req.body.cardImage = req.file.path
        }

        updateCardId = await card.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Card Updated SuccessFully...", card: updateCardId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteCardTitleById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCardTitleId = await card.findById(id)

        if (!deleteCardTitleId) {
            return res.status(404).json({ status: 404, message: "Card Not Found" })
        }

        await card.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Card Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}