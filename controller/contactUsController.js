const contactUs = require('../model/contactUsModels');

exports.createContactUs = async (req, res) => {
    try {
        let { name, email, contactNo, subject, message } = req.body

        let createContact = await contactUs.create({
            name,
            email,
            contactNo,
            subject,
            message
        })

        return res.status(201).json({ status: 201, message: "Message Sent SuccessFully...", contactUs: createContact });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllContactUs = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedContactUs;

        paginatedContactUs = await contactUs.find();

        let count = paginatedContactUs.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "ContactUs Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize;
            let lastIndex = (startIndex + pageSize)
            paginatedContactUs = await paginatedContactUs.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalContactUs: count, message: "All ContactUs Found SuccessFully...", contactUs: paginatedContactUs })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getContactUsById = async (req, res) => {
    try {
        let id = req.params.id

        let getContactUsId = await contactUs.findById(id)

        if (!getContactUsId) {
            return res.status(404).json({ status: 404, message: "ContactUs Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Contact Us Found SuccessFully...", contactUs: getContactUsId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteContactUsById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteContactUsId = await contactUs.findById(id)

        if (!deleteContactUsId) {
            return res.status(404).json({ status: 404, message: "Contact Us Not Found" })
        }

        await contactUs.findByIdAndDelete(id);
        
        return res.status(200).json({ status: 200, message: "Contact Us Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}