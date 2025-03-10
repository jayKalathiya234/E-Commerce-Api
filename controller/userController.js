const user = require('../model/userModel');
const bcrypt = require('bcrypt')
let otp = 1234

exports.createNewUserAdmin = async (req, res) => {
    try {
        let { name, email, mobileNo, password, role } = req.body

        let checkExistMobileNo = await user.findOne({ email })

        if (checkExistMobileNo) {
            return res.status(409).json({ status: 409, message: "Mobile No Is Already Exist" })
        }

        let salt = await bcrypt.genSalt(10)
        let hasPassword = await bcrypt.hash(password, salt)

        checkExistMobileNo = await user.create({
            name,
            email,
            mobileNo,
            password: hasPassword,
            role: 'admin',
        });

        return res.status(201).json({ status: 201, message: "Admin Create SuccessFully...", user: checkExistMobileNo })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.createNewUser = async (req, res) => {
    try {
        let { name, mobileNo, password, role } = req.body

        let checkExistMobileNo = await user.findOne({ mobileNo })

        if (checkExistMobileNo) {
            return res.status(409).json({ status: 409, message: "Mobile No Alredy Exist" })
        }

        let salt = await bcrypt.genSalt(10)
        let hasPassword = await bcrypt.hash(password, salt)

        checkExistMobileNo = await user.create({
            name,
            mobileNo,
            password: hasPassword,
            role: 'user',
            otp
        });

        return res.status(201).json({ status: 201, message: "Otp Send SuccessFully....", user: checkExistMobileNo })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedUser;

        paginatedUser = await user.find()

        let count = paginatedUser.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedUser = await paginatedUser.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUser: count, message: "All Users Found SuccessFully...", user: paginatedUser });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        let id = req.user._id

        let getUserId = await user.findById(id)

        if (!getUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "User Found SuccessFully...", user: getUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateUserById = async (req, res) => {
    try {
        let id = req.user._id

        let updateUserId = await user.findById(id)

        if (!updateUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (req.file) {
            req.body.image = req.file.path
        }

        updateUserId = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "User Updated SuccessFully...", user: updateUserId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deactiveUserAccount = async (req, res) => {
    try {
        let id = req.user._id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId || deleteUserId.active === true) {
            return res.status(404).json({ status: 404, message: "User is Active" })
        }

        deleteUserId.otp = 4567

        await deleteUserId.save();

        return res.status(200).json({ status: 200, message: "User Acccount Deactive Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deactiveAccoutOtpVerify = async (req, res) => {
    try {
        let id = req.user._id

        let { otp } = req.body

        let checkUser = await user.findById(id)

        if (!checkUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (checkUser.otp != otp) {
            return res.status(404).json({ status: 404, message: "Invalid Otp" })
        }

        checkUser.otp = undefined;

        await user.findByIdAndUpdate(id, { active: true }, { new: true })

        return res.status(200).json({ status: 200, message: "Account Deactive SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.resendOtpDeactiveAccount = async (req, res) => {
    try {
        let id = req.user._id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId || deleteUserId.active === true) {
            return res.status(404).json({ status: 404, message: "User is Active" })
        }

        deleteUserId.otp = 7654

        await deleteUserId.save();

        return res.status(200).json({ status: 200, message: "Acccount Deactive Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.activeUserAccount = async (req, res) => {
    try {
        let id = req.user._id

        let DeactiveUserId = await user.findById(id)

        if (!DeactiveUserId || DeactiveUserId.active === false) {
            return res.status(404).json({ status: 404, message: "User is Not active" })
        }

        DeactiveUserId.otp = 5678

        await DeactiveUserId.save();

        return res.status(200).json({ status: 200, message: "Acccount Activated Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.activeAccoutOtpVerify = async (req, res) => {
    try {
        let id = req.user._id

        let { otp } = req.body

        let checkUser = await user.findById(id)

        if (!checkUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (checkUser.otp != otp) {
            return res.status(404).json({ status: 404, message: "Invalid Otp" })
        }

        checkUser.otp = undefined;

        await user.findByIdAndUpdate(id, { active: false }, { new: true })

        return res.status(200).json({ status: 200, message: "Account Deactive SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.resendOtpActiveAccount = async (req, res) => {
    try {
        let id = req.user._id

        let DeactiveUserId = await user.findById(id)

        if (!DeactiveUserId || DeactiveUserId.active === false) {
            return res.status(404).json({ status: 404, message: "User is Not active" })
        }

        DeactiveUserId.otp = 8765

        await DeactiveUserId.save();

        return res.status(200).json({ status: 200, message: "Acccount Activated Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        await user.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "User Delete SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(200).json({ status: 200, message: error.message })
    }
}