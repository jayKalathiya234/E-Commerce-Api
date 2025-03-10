const user = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.userLogin = async (req, res) => {
    try {
        let { mobileNo, password } = req.body;

        let checkMobileNo = await user.findOne({ mobileNo, active: false })

        if (!checkMobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Not Found" })
        }

        let comparePassword = await bcrypt.compare(password, checkMobileNo.password)

        if (!comparePassword) {
            return res.status(404).json({ status: 404, message: "Password Not Found" })
        }

        let token = jwt.sign({ _id: checkMobileNo._id }, process.env.SECRET_KEY, { expiresIn: '1D' });

        return res.status(200).json({ status: 200, message: "User Login SuccessFully...", user: checkMobileNo, token: token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.adminLogin = async (req, res) => {
    try {
        let { mobileNo, password } = req.body

        let checkEmail = await user.findOne({ mobileNo, role: 'admin' })

        if (!checkEmail) {
            return res.status(404).json({ status: 404, message: "Mobile Not Found" })
        }

        let comparePassword = await bcrypt.compare(password, checkEmail.password)

        if (!comparePassword) {
            return res.status(404).json({ status: 404, message: "Password Not Found" })
        }

        let token = jwt.sign({ _id: checkEmail._id }, process.env.SECRET_KEY, { expiresIn: '1D' });

        return res.status(200).json({ status: 200, message: "Admin Login SuccessFully...", adminUser: checkEmail, token: token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        let { mobileNo, otp } = req.body

        let checkMobileNo = await user.findOne({ mobileNo })

        if (!checkMobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Not Found" })
        }

        if (checkMobileNo.otp != otp) {
            return res.status(404).json({ status: 404, message: "Invalid Otp" })
        }

        checkMobileNo.otp = undefined

        await checkMobileNo.save();

        let token = jwt.sign({ _id: checkMobileNo._id }, process.env.SECRET_KEY, { expiresIn: '1D' });

        return res.status(200).json({ status: 200, message: "Otp Verify SuccessFully...", user: checkMobileNo, token: token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

let otp = 5678

exports.forgotPassword = async (req, res) => {
    try {
        let { mobileNo } = req.body

        let checkMobileNo = await user.findOne({ mobileNo })

        if (!checkMobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Not Found" })
        }

        checkMobileNo.otp = otp

        await checkMobileNo.save()

        return res.status(200).json({ status: 200, message: "Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let id = req.params.id

        let userId = await user.findById(id);

        if (!userId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.json({ status: 400, message: "New Password And Confirm Password Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(newPassword, salt);

        let updatePassword = await user.findByIdAndUpdate(id, { password: hashPassword }, { new: true })

        return res.json({ status: 200, message: "Password Changed SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        let id = req.user._id

        let getUser = await user.findById(id)

        if (!getUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let { currentPassword, newPassword, confirmPassword } = req.body

        let checkCurrentPassword = await bcrypt.compare(currentPassword, getUser.password)

        if (!checkCurrentPassword) {
            return res.status(404).json({ status: 404, message: "Invalid Current Password" })
        }

        if (newPassword !== confirmPassword) {
            return res.json({ status: 400, message: "New Password And Confirm Password Not Match" })
        }

        let salt = await bcrypt.genSalt(10);

        let hashPassword = await bcrypt.hash(newPassword, salt);

        let updatePassword = await user.findByIdAndUpdate(id, { password: hashPassword }, { new: true });

        return res.status(200).json({ status: 200, message: "Password Update SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDeactiveUser = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedDeactiveUser;

        paginatedDeactiveUser = await user.find({ active: true })

        let count = paginatedDeactiveUser.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "user not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedDeactiveUser = await paginatedDeactiveUser.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalDeactiveUser: count, message: "All Deactive User Found SuccessFully...", deactiveUser: paginatedDeactiveUser })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}