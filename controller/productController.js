const product = require('../model/productModel');

exports.createProduct = async (req, res) => {
    try {
        const { mainCategoryId, categoryId, subCategoryId, productName } = req.body;

        let checkExistProduct = await product.findOne({ mainCategoryId, categoryId, subCategoryId, productName })

        if (checkExistProduct) {
            return res.status(409).json({ status: 409, message: "Product Alredy Exist" })
        }

        // const colorDetails = req.body.colorDetails
        //     ? (typeof req.body.colorDetails === 'string'
        //         ? JSON.parse(req.body.colorDetails)
        //         : req.body.colorDetails)
        //     : [];

        // const totalExpectedImages = colorDetails.reduce((sum, color) => sum + (parseInt(color.imageCount) || 0), 0);

        // if (totalExpectedImages !== req.files.length) {
        //     return res.status(400).json({
        //         status: 400,
        //         message: `Image count mismatch. Expected ${totalExpectedImages} images but received ${req.files.length}`
        //     });
        // }

        // let currentImageIndex = 0;
        // const processedColorDetails = [];

        // for (const color of colorDetails) {
        //     const imageCount = parseInt(color.imageCount) || 0;

        //     const colorImages = [];
        //     for (let i = 0; i < imageCount; i++) {
        //         if (currentImageIndex < req.files.length) {
        //             colorImages.push(`/images/${req.files[currentImageIndex].filename}`);
        //             currentImageIndex++;
        //         }
        //     }

        //     processedColorDetails.push({
        //         colorName: color.colorName,
        //         images: colorImages,
        //     });
        // }

        // if (currentImageIndex !== req.files.length) {
        //     return res.status(400).json({ status: 400, message: "Not all images were properly processed" });
        // }


        const newProduct = await product.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            productName,
            // title,
            // description,
            // currentPrice,
            // originalPrice,
            // discount,
            // specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
            // sizeCharts: typeof sizeCharts === 'string' ? JSON.parse(sizeCharts) : sizeCharts,
            // colorDetails: processedColorDetails
        });

        return res.status(200).json({ status: 200, message: "Product Created Successfully", product: newProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.messageF });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedProducts;

        paginatedProducts = await product.aggregate([
            {
                $lookup: {
                    from: "maincategories",
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoriesData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: "_id",
                    as: 'categoriesData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategoryId',
                    foreignField: "_id",
                    as: 'subCategoriesData'
                }
            },
            {
                $lookup: {
                    from: "productvariants",
                    localField: "_id",
                    foreignField: "productId",
                    as: "productVariantData"
                }
            },
            {
                $lookup: {
                    from: "sizes",
                    localField: "productVariantData.sizeNameId",
                    foreignField: "_id",
                    as: "sizeData"
                }
            },
            {
                $lookup: {
                    from: "units",
                    localField: "productVariantData.unitId",
                    foreignField: "_id",
                    as: "unitData"
                }
            },
            {
                $lookup: {
                    from: "productoffers",
                    localField: "productVariantData.productOfferId",
                    foreignField: "_id",
                    as: "productOfferData"
                }
            }
        ])

        let count = paginatedProducts.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedProducts = await paginatedProducts.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalProducts: count, message: "All Product Found SuccessFully...", product: paginatedProducts });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getProductById = async (req, res) => {
    try {
        let id = req.params.id

        let getProductId = await product.findById(id)

        if (!getProductId) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Product Found SuccessFully...", product: getProductId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const { mainCategoryId, categoryId, subCategoryId, productName, description, currentPrice, originalPrice, discount, specifications, sizeCharts, colorDetails, stockStatus } = req.body;

        const existingProduct = await product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found" });
        }

        if (mainCategoryId !== undefined) existingProduct.mainCategoryId = mainCategoryId;
        if (categoryId !== undefined) existingProduct.categoryId = categoryId;
        if (subCategoryId !== undefined) existingProduct.subCategoryId = subCategoryId;
        if (productName !== undefined) existingProduct.productName = productName;
        if (description !== undefined) existingProduct.description = description;
        if (currentPrice !== undefined) existingProduct.currentPrice = currentPrice;
        if (originalPrice !== undefined) existingProduct.originalPrice = originalPrice;
        if (discount !== undefined) existingProduct.discount = discount;
        if (stockStatus !== undefined) existingProduct.stockStatus = stockStatus;

        if (specifications && typeof specifications === 'object') {
            existingProduct.specifications = {
                ...existingProduct.specifications,
                ...specifications
            };
        }
        if (sizeCharts) {
            existingProduct.sizeCharts = {
                ...existingProduct.sizeCharts,
                ...sizeCharts
            }
        }
        // if (sizeCharts && Array.isArray(sizeCharts)) {
        //     existingProduct.sizeCharts = [
        //         ...existingProduct.sizeCharts,
        //         ...sizeCharts
        //     ];
        // }


        if (colorDetails) {
            let newColorDetails = colorDetails;
            if (typeof colorDetails === 'string') {
                try {
                    console.log(newColorDetails);
                    newColorDetails = JSON.parse(colorDetails);
                } catch (error) {
                    return res.status(400).json({ status: 400, message: 'Invalid colorDetails JSON format' });
                }
            }

            const updatedColorDetails = [];
            let currentImageIndex = 0;

            for (const color of newColorDetails) {
                const colorImages = [];
                const imageCount = parseInt(color.imageCount) || 0;
                console.log(imageCount);
                for (let i = 0; i < imageCount; i++) {
                    if (req.files && currentImageIndex < req.files.length) {
                        const imagePath = `/images/${req.files[currentImageIndex].filename}`;
                        colorImages.push(imagePath);
                        currentImageIndex++;
                    }
                }

                updatedColorDetails.push({
                    colorName: color.colorName,
                    images: colorImages,
                });
            }

            existingProduct.colorDetails = [
                ...existingProduct.colorDetails,
                ...updatedColorDetails
            ];
        }

        const updatedProduct = await existingProduct.save();

        return res.status(200).json({ status: 200, message: "Product Updated Successfully...", product: updatedProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteProductId = await product.findById(id)

        if (!deleteProductId) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        await product.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Product Delete SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
