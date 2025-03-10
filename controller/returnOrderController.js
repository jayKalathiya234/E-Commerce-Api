const returnOrder = require('../model/returnOrderModel');
const order = require('../model/orderModel');
const mongoose = require('mongoose');
let otp = 123456

exports.createReturnOrder = async (req, res) => {
    try {
        let { orderId, reasonForReturn, mobileNo } = req.body

        let checkOrder = await order.findById(orderId)

        if (!checkOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        let existReturnOrder = await returnOrder.findOne({ orderId, userId: req.user._id })

        if (existReturnOrder) {
            return res.status(409).json({ status: 409, message: "Order Alredy Return" })
        }

        // existReturnOrder.otp = otp

        // await existReturnOrder.save();

        existReturnOrder = await returnOrder.create({
            orderId,
            userId: req.user._id,
            reasonForReturn,
            mobileNo,
            otp: otp
        });

        return res.status(201).json({ status: 201, message: "Otp Sent SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.returnOrderVerifyOtp = async (req, res) => {
    try {
        let { orderId, otp, mobileNo } = req.body;

        let checkOrder = await order.findById(orderId)

        if (!checkOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        let returnOrderData = await returnOrder.findOne({ orderId, userId: req.user._id, mobileNo });

        if (!returnOrderData) {
            return res.status(404).json({ status: 404, message: "Return Order not found" });
        }


        if (returnOrderData.otp !== otp) {
            return res.status(400).json({ status: 400, message: "Invalid OTP" });
        }

        checkOrder.isReturn = true

        // returnOrderData.reasonForReturn = reasonForReturn;
        returnOrderData.otp = undefined;
        returnOrderData.mobileNo = mobileNo;

        await checkOrder.save();
        await returnOrderData.save();

        return res.status(200).json({ status: 200, message: "Return Order Created Successfully", returnOrder: returnOrderData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getAllReturnOrder = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedReturnOrder;

        paginatedReturnOrder = await returnOrder.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'orderData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderData.items.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'orderData.items.productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            },
            {
                $lookup: {
                    from: 'reasonofcancellations',
                    localField: 'reasonForReturn',
                    foreignField: '_id',
                    as: 'cancellationData'
                }
            }
        ])

        let count = paginatedReturnOrder.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Return Order Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedReturnOrder = await paginatedReturnOrder.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalReturnOrder: count, message: "All Return Order Found SuccessFully...", returnOrder: paginatedReturnOrder });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getReturnOrderDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getReturnOrderId = await returnOrder.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'orderData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderData.items.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'orderData.items.productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            },
            {
                $lookup: {
                    from: 'reasonofcancellations',
                    localField: 'reasonForReturn',
                    foreignField: '_id',
                    as: 'cancellationData'
                }
            }
        ])

        if (!getReturnOrderId) {
            return res.status(404).json({ status: 404, message: "Return Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Return Order Found SuccessFully...", returnOrder: getReturnOrderId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.changeReturnOrderStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let { returnOrderStatus } = req.body

        let changeReturnOrderStatusId = await returnOrder.findById(id)

        if (!changeReturnOrderStatusId) {
            return res.status(404).json({ status: 404, message: "Return Order Not found" })
        }

        changeReturnOrderStatusId.returnOrderStatus = returnOrderStatus

        await changeReturnOrderStatusId.save();

        return res.status(200).json({ status: 200, message: "Return Order Status Update SuccessFully...", returnOrder: changeReturnOrderStatusId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllMyReturnOrderData = async (req, res) => {
    try {
        let id = req.user._id

        let getAllMyReturnOrder = await returnOrder.find({ userId: id })

        if (!getAllMyReturnOrder) {
            return res.status(404).json({ status: 404, message: "Return Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All My Return Orders Found SuccessFully...", myReturnOrder: getAllMyReturnOrder })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
