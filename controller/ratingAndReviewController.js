const ratingAndReview = require('../model/ratingAndReviewModel')
const mongoose = require('mongoose')

exports.createRatingAndReview = async (req, res) => {
    try {
        let { userId, productId, productVariantId, rating, review, productImages } = req.body

        let checkExistRating = await ratingAndReview.findOne({ userId, productId, productVariantId })

        if (checkExistRating) {
            return res.status(404).json({ status: 404, message: "Rating And Review alredy Exist" })
        }

        let files = req.files['productImages'] ? req.files['productImages'] : undefined

        if (files) {
            productImages = files.map(file => file.path);
        }

        checkExistRating = await ratingAndReview.create({
            userId: req.user._id,
            productId,
            productVariantId,
            rating,
            review,
            productImages
        })

        return res.status(201).json({ status: 201, message: "Rating And Review Created SuccessFully...", ratingAndReview: checkExistRating })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllRatingAndReview = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedRatingAndReview;

        paginatedRatingAndReview = await ratingAndReview.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
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
                    from: 'productvariants',
                    localField: 'productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            }
        ])

        let count = paginatedRatingAndReview.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Rating And Review Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedRatingAndReview = await paginatedRatingAndReview.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalRatingAndReview: count, message: "All Rating And Review Found SuccessFully...", ratingAndReview: paginatedRatingAndReview });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getRatingAndReviewById = async (req, res) => {
    try {
        let id = req.params.id

        let getRatingAndReviewId = await ratingAndReview.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
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
                    from: 'productvariants',
                    localField: 'productVariantId',
                    foreignField: '_id',
                    as: 'productVariantData'
                }
            }
        ])

        if (!getRatingAndReviewId) {
            return res.status(404).json({ status: 404, message: "Rating And Review Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Rating And Review Found SuccessFully...", ratingAndReview: getRatingAndReviewId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateRatingAndReview = async (req, res) => {
    try {
        let id = req.params.id

        let existingReview = await ratingAndReview.findById(id);

        if (!existingReview) {
            return res.status(404).json({ status: 404, message: "Rating and Review Not Found" });
        }

        let files = req.files['productImages'] ? req.files['productImages'] : undefined;

        if (files) {
            req.body.productImages = files.map(file => file.path);
        }

        existingReview = await ratingAndReview.findByIdAndUpdate(id, { ...req.body }, { new: true })


        return res.status(200).json({ status: 200, message: "Rating and Review updated successfully.", ratingAndReview: existingReview });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteRaingAndReviewById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteRatingAndReviewId = await ratingAndReview.findById(id)

        if (!deleteRatingAndReviewId) {
            return res.status(404).json({ status: 404, message: "Rating and Review Not Found" })
        }

        await ratingAndReview.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Rating And Review Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getMyRatingAndReview = async (req, res) => {
    try {
        let id = req.user._id

        let getMyRating = await ratingAndReview.find({ userId: id })

        if (!getMyRating) {
            return res.status(404).json({ status: 404, message: "Rating and Review Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Rating and Review Found SuccessFully...", myRatingAndReview: getMyRating })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}