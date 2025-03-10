const help = require('../model/helpModel')

exports.createHelpQuestion = async (req, res) => {
    try {
        let { helpQuestion, answer } = req.body

        let checkHelpQustionIsExist = await help.findOne({ helpQuestion })

        if (checkHelpQustionIsExist) {
            return res.status(409).json({ status: 409, message: "Help Question Alredy Exist" })
        }

        checkHelpQustionIsExist = await help.create({
            helpQuestion,
            answer
        })

        return res.status(200).json({ status: 200, message: "Help Question Create SuccessFully...", helpQuestion: checkHelpQustionIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllHelpQuestions = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedHelpQuestions;

        paginatedHelpQuestions = await help.find()

        let count = paginatedHelpQuestions.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Help Question Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedHelpQuestions = paginatedHelpQuestions.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalHelpQuestions: count, message: "All Help Questions Found SuccessFully...", helpQuestion: paginatedHelpQuestions })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getHelpQuestionById = async (req, res) => {
    try {
        let id = req.params.id

        let getHelpQuestionId = await help.findById(id)

        if (!getHelpQuestionId) {
            return res.status(404).json({ status: 404, message: "Help Question Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Help Question Found SuccessFully...", helpQuestion: getHelpQuestionId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateHelpQuestionById = async (req, res) => {
    try {
        let id = req.params.id

        let updateHelpQuestionId = await help.findById(id)

        if (!updateHelpQuestionId) {
            return res.status(404).json({ status: 404, message: "Help Question Not Found" })
        }

        updateHelpQuestionId = await help.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Help Question Updated SuccessFully...", helpQuestion: updateHelpQuestionId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteHelpQuestionById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteHelpQuestionId = await help.findById(id)

        if (!deleteHelpQuestionId) {
            return res.status(404).json({ status: 404, message: "Help Question Not Found" })
        }

        await help.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Help Question Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}