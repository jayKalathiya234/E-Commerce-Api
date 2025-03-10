const Address = require('../model/addressModel');

exports.createAddress = async (req, res) => {
    try {
        let { name, contactNo, address, landmark, pincode, city, state, addressType } = req.body

        let addressCreate = await Address.create({
            userId: req.user._id,
            name,
            contactNo,
            address,
            landmark,
            pincode,
            city,
            state,
            addressType
        });

        return res.status(201).json({ status: 201, message: "address Create SuccessFully...", address: addressCreate });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllAddress = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedAddress;

        paginatedAddress = await Address.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            }
        ])

        let count = paginatedAddress.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAddress = await paginatedAddress.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalAddress: count, message: "All Adrress Found SuccessFully...", address: paginatedAddress })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let getAddressId = await Address.findById(id)

        if (!getAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Address Found SuccessFully...", address: getAddressId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let updateAddressId = await Address.findById(id)

        if (!updateAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        updateAddressId = await Address.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Address Update SuccessFully...", address: updateAddressId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deleteAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteAddressId = await Address.findById(id)

        if (!deleteAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        await Address.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Address Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllMyAddress = async (req, res) => {
    try {
        let id = req.user._id

        let getMyAddress = await Address.find({ userId: id })

        if (!getMyAddress) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Address Found SuccessFully....", address: getMyAddress })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}