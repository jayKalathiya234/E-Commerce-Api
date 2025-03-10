const wishlist = require('../model/wishListModel')

exports.createWishList = async (req, res) => {
    try {
        let { userId, productId } = req.body

        let checkExistWishList = await wishlist.findOne({ userId, productId })

        if (checkExistWishList) {
            return res.status(409).json({ status: 409, message: "Product Alredy Exist..." })
        }

        checkExistWishList = await wishlist.create({
            userId,
            productId
        });

        return res.status(200).json({ status: 200, message: "WishList Created SuccessFully...", wishlist: checkExistWishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllWishList = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page and PageSize Cann't Be Less Than 1" })
        }

        let paginatedWishList;

        paginatedWishList = await wishlist.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productData._id',
                    foreignField: 'productId',
                    as: "productVariantData"
                }
            }
        ])

        let count = paginatedWishList.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "wishList Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedWishList = await paginatedWishList.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalWishList: count, message: "All Wish List Found SuccessFully...", wishlist: paginatedWishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getWishListById = async (req, res) => {
    try {
        let id = req.params.id

        let getWishListId = await wishlist.findById(id)

        if (!getWishListId) {
            return res.status(404).json({ status: 404, message: "Wishlist Not found" })
        }

        return res.status(200).json({ status: 200, message: "wishList Found SuccessFully...", wishlist: getWishListId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteWishlListById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteWishListId = await wishlist.findById(id)

        if (!deleteWishListId) {
            return res.status(404).json({ status: 404, message: "Wishlist Not Found" })
        }

        await wishlist.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Wishlist Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getMyWishListById = async (req, res) => {
    try {
        let id = req.user._id

        let getMyWishListId = await wishlist.aggregate([
            {
                $match: {
                    userId: id
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productData._id',
                    foreignField: 'productId',
                    as: "productVariantData"
                }
            }
        ])

        if (!getMyWishListId) {
            return res.status(404).json({ status: 404, message: "WishList Not Found" })
        }

        return res.status(200).json({ status: 200, message: "WishList Found SuccessFully...", wishlist: getMyWishListId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
