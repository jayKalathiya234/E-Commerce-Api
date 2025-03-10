const order = require('../model/orderModel')
const Address = require('../model/addressModel')
const Coupon = require('../model/specialOfferModel');
const Product = require('../model/productModel')
const ProductVariant = require('../model/productVariantModel');
const productOffer = require('../model/productOfferModel')
const stock = require('../model/stockModle');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
    try {
        let { userId, addressId, items, coupenId, productOfferId } = req.body;

        let checkAddress = await Address.findById(addressId);

        if (!checkAddress) {
            return res.status(404).json({ status: 404, message: "Address Not Found" });
        }

        let products = [];
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const variant = await ProductVariant.findById(item.productVariantId);
            if (!variant) {
                return res.status(404).json({ message: 'Product variant not found' });
            }

            products.push({ product, variant, quantity: item.quantity });
        }

        let coupon;
        if (coupenId) {
            coupon = await Coupon.findById(coupenId);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found' });
            }
        }

        if (productOfferId) {
            coupon = await productOffer.findById(productOfferId);
            if (!coupon) {
                return res.status(404).json({ message: 'Product Offer not found' });
            }
        }

        let totalAmount = 0;
        for (const { variant, quantity } of products) {
            totalAmount += variant.discountPrice * quantity
        }

        if (coupon) {
            if (coupon.coupenType === 'Fixed') {
                totalAmount -= coupon.offerDiscount;

            } else if (coupon.coupenType === 'Percentage') {
                totalAmount -= (totalAmount * parseFloat(coupon.offerDiscount) / 100);
            }
        }

        if (productOfferId) {
            totalAmount -= coupon.price
        }

        let deliveryType, deliveryCost

        if (deliveryType === 'Express') {
            deliveryCost = 35;
        } else if (deliveryType === 'Standard') {
            deliveryCost = 20;
        } else {
            deliveryType === 'Free';
            deliveryCost = 0;
        }

        const orderCreate = await order.create({
            userId,
            addressId,
            items: products.map(({ product, variant, quantity }) => ({
                productId: product._id,
                productVariantId: variant._id,
                quantity
            })),
            coupenId,
            totalAmount: totalAmount + deliveryCost,
            deliveryType,
            paymentMethod: 'received'
        });

        for (let item of products) {
            let { product, variant, quantity } = item;

            product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            await product.save();

            let stockData = await stock.findOne({ productId: item.product })
            stockData.quantity -= quantity;
            await stockData.save();
        }


        return res.status(201).json({ status: 201, message: "Order Created SuccessFully....", order: orderCreate });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedOrders;

        paginatedOrders = await order.aggregate([
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
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'addressData'
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'items.productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            },
            {
                $lookup: {
                    from: 'specialoffers',
                    localField: 'coupenId',
                    foreignField: '_id',
                    as: 'coupenData'
                }
            },
            {
                $lookup: {
                    from: 'productoffers',
                    localField: 'productOfferId',
                    foreignField: '_id',
                    as: 'productOfferData'
                }
            }
        ])

        let count = paginatedOrders.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedOrders = await paginatedOrders.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalOrders: count, message: "All Orders Found SuccessFully...", orders: paginatedOrders });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let getOrderId = await order.aggregate([
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
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'addressData'
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'items.productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            },
            {
                $lookup: {
                    from: 'specialoffers',
                    localField: 'coupenId',
                    foreignField: '_id',
                    as: 'coupenData'
                }
            },
            {
                $lookup: {
                    from: 'productoffers',
                    localField: 'productOfferId',
                    foreignField: '_id',
                    as: 'productOfferData'
                }
            }
        ])

        if (!getOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Order Found SuccessFully...", order: getOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateOrderById = async (req, res) => {
    try {
        let id = req.params.id;

        let { addressId, items, coupenId, productOfferId, deliveryType } = req.body;

        const chekOrder = await order.findById(id);

        if (!chekOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" });
        }

        let products = [...chekOrder.items];

        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const variant = await ProductVariant.findById(item.productVariantId);
            if (!variant) {
                return res.status(404).json({ message: 'Product variant not found' });
            }

            let existingItemIndex = products.findIndex(p => p.productId.toString() === item.productId && p.productVariantId.toString() === item.productVariantId);

            if (existingItemIndex !== -1) {
                products[existingItemIndex].quantity += item.quantity;
            } else {
                products.push({
                    productId: product._id,
                    productVariantId: variant._id,
                    quantity: item.quantity
                });
            }
        }

        let coupon;
        if (coupenId) {
            coupon = await Coupon.findById(coupenId);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found' });
            }
        }

        if (productOfferId) {
            coupon = await productOffer.findById(productOfferId);
            if (!coupon) {
                return res.status(404).json({ message: 'Product Offer not found' });
            }
        }

        let totalAmount = 0;
        for (const { productId, productVariantId, quantity } of products) {
            const product = await Product.findById(productId);
            const variant = await ProductVariant.findById(productVariantId);
            totalAmount += variant.discountPrice * quantity;
        }

        if (coupon) {
            if (coupon.coupenType === 'Fixed') {
                totalAmount -= coupon.offerDiscount;
            } else if (coupon.coupenType === 'Percentage') {
                totalAmount -= (totalAmount * parseFloat(coupon.offerDiscount) / 100);
            }
        }

        if (productOfferId) {
            totalAmount -= coupon.price
        }

        let deliveryCost;
        if (deliveryType === 'Express') {
            deliveryCost = 35;
        } else if (deliveryType === 'Standard') {
            deliveryCost = 20;
        } else {
            deliveryCost = 0;
        }

        totalAmount += deliveryCost;

        chekOrder.items = products.map(({ productId, productVariantId, quantity }) => ({
            productId,
            productVariantId,
            quantity
        }));

        chekOrder.totalAmount = totalAmount;
        chekOrder.deliveryType = deliveryType;
        chekOrder.coupenId = coupon?._id;
        chekOrder.productOfferId = coupon?.productOfferId;

        const updatedOrder = await chekOrder.save();

        return res.status(200).json({ status: 200, message: "Order Updated Successfully", order: updatedOrder });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.updateOrderItemQuantityById = async (req, res) => {
    try {
        let id = req.params.id

        let { quantity } = req.body

        let getItemId = await order.findOne({ "items._id": id })

        if (!getItemId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" });
        }

        let getItemData = getItemId.items.id(id)

        if (quantity !== undefined) {
            getItemData.quantity = quantity
        }

        await getItemId.save();

        return res.status(200).json({ status: 200, message: "Order Item Quantity Updated Successfully...", order: getItemId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteOrderItemById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteOrderItemId = await order.findOne({ "items._id": id })

        if (!deleteOrderItemId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        deleteOrderItemId = await order.findOneAndUpdate({ "items._id": id }, { $pull: { items: { _id: id } } }, { new: true })

        return res.status(200).json({ status: 200, message: "Order Item Delete SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteOrderId = await order.findById(id)

        if (!deleteOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        await order.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Order Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllMyOrders = async (req, res) => {
    try {
        let id = req.user._id

        let getAllMyOrders = await order.aggregate([
            {
                $match: {
                    userId: id
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
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'addressData'
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'items.productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            },
            {
                $lookup: {
                    from: 'specialoffers',
                    localField: 'coupenId',
                    foreignField: '_id',
                    as: 'coupenData'
                }
            },
            {
                $lookup: {
                    from: 'productoffers',
                    localField: 'productOfferId',
                    foreignField: '_id',
                    as: 'productOfferData'
                }
            }
        ])

        return res.status(200).json({ status: 200, message: "All My Order Found SuccessFully...", allMyOrders: getAllMyOrders })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}