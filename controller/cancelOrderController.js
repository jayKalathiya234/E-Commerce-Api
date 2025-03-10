const mongoose = require('mongoose');
const cancelOrder = require('../model/cancelOrderModel')
const order = require('../model/orderModel');

exports.createCancelOrder = async (req, res) => {
    try {
        let { orderId, reasonForCancellationId, comments } = req.body

        let getOrderData = await order.findById(orderId)

        let checkExistCancelOrder = await cancelOrder.findOne({ orderId })

        if (checkExistCancelOrder) {
            return res.status(409).json({ status: 409, message: "Order is already cancelled" })
        }

        checkExistCancelOrder = await cancelOrder.create({
            orderId,
            reasonForCancellationId,
            comments
        });

        getOrderData.orderStatus = "Cancelled"
        await getOrderData.save()

        return res.status(201).json({ status: 201, message: "Order Cancelled SuccessFully...", cancelOrder: checkExistCancelOrder })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCancelledOrders = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCancelledOrders;

        paginatedCancelledOrders = await cancelOrder.aggregate([
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
                    from: "reasonofcancellations",
                    localField: "reasonForCancellationId",
                    foreignField: "_id",
                    as: "reasonForCancellationData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "orderData.userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderData.items.productId",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $lookup: {
                    from: "productvariants",
                    localField: "orderData.items.productVariantId",
                    foreignField: "_id",
                    as: "productVariantData"
                }
            },
        ])

        let count = paginatedCancelledOrders.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Cancelle Orders Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCancelledOrders = await paginatedCancelledOrders.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalCancellerOrders: count, message: "All Cancelled Orders Found SuccessFully...", order: paginatedCancelledOrders })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getCancelledOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let getCancelledOrderId = await cancelOrder.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
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
                    from: "reasonofcancellations",
                    localField: "reasonForCancellationId",
                    foreignField: "_id",
                    as: "reasonForCancellationData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "orderData.userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderData.items.productId",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $lookup: {
                    from: "productvariants",
                    localField: "orderData.items.productVariantId",
                    foreignField: "_id",
                    as: "productVariantData"
                }
            },
        ])

        return res.status(200).json({ status: 200, message: "All Cancelled Order Found SuccessFully...", cancelleOrder: getCancelledOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}