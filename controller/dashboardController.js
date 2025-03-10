const Order = require('../model/orderModel');
const review = require('../model/ratingAndReviewModel')

const getDateRange = (timeframe, year, month) => {
    const currentDate = new Date();
    let startDate, endDate;

    if (!timeframe) {
        const currentYear = year || currentDate.getFullYear();
        const currentMonth = month || (currentDate.getMonth() + 1);
        startDate = new Date(currentYear, currentMonth - 1, 1);
        endDate = new Date(currentYear, currentMonth, 0);
        return { startDate, endDate };
    }

    switch (timeframe) {
        case 'week':
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7);
            endDate = new Date(currentDate);
            break;
        case 'month':
            if (year && month) {
                startDate = new Date(year, month - 1, 1);
                endDate = new Date(year, month, 0);
            } else {
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            }
            break;
        case 'year':
            const selectedYear = year || currentDate.getFullYear();
            startDate = new Date(selectedYear, 0, 1);
            endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
            break;
        default:
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }
    return { startDate, endDate };
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const startDate = new Date('1970-01-01');
        const endDate = new Date();
        const prevStartDate = new Date(startDate);
        const prevEndDate = new Date(endDate);

        const diffTime = endDate.getTime() - startDate.getTime();
        prevStartDate.setTime(prevStartDate.getTime() - diffTime);
        prevEndDate.setTime(prevEndDate.getTime() - diffTime);

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;

        const summaryData = await Order.aggregate([
            {
                $facet: {
                    currentPeriod: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: startDate,
                                    $lte: endDate
                                }
                            }
                        },
                        {
                            $unwind: "$items"
                        },
                        {
                            $group: {
                                _id: "$_id",
                                totalIncome: { $first: "$totalAmount" },
                                totalSales: { $sum: "$items.quantity" },
                                userId: { $first: "$userId" },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: "$totalSales" },
                                totalIncome: { $sum: "$totalIncome" },
                                totalOrders: { $sum: 1 },
                                uniqueCustomers: { $addToSet: "$userId" }
                            }
                        },
                        {
                            $project: {
                                totalSales: 1,
                                totalIncome: 1,
                                totalOrders: 1,
                                totalCustomers: { $size: "$uniqueCustomers" }
                            }
                        }
                    ],
                    currentYearMonthly: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${currentYear}-01-01`),
                                    $lte: endDate
                                }
                            }
                        },
                        {
                            $unwind: "$items"
                        },
                        {
                            $group: {
                                _id: {
                                    month: { $month: "$createdAt" }
                                },
                                sales: { $sum: "$items.quantity" },
                                income: { $sum: "$totalAmount" },
                                orders: { $sum: 1 },
                                customers: { $addToSet: "$userId" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                sales: 1,
                                income: 1,
                                orders: 1,
                                customers: { $size: "$customers" }
                            }
                        },
                        {
                            $sort: { month: 1 }
                        }
                    ],
                    previousYearMonthly: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${previousYear}-01-01`),
                                    $lte: new Date(`${previousYear}-12-31`)
                                }
                            }
                        },
                        {
                            $unwind: "$items"
                        },
                        {
                            $group: {
                                _id: {
                                    month: { $month: "$createdAt" }
                                },
                                sales: { $sum: "$items.quantity" },
                                income: { $sum: "$totalAmount" },
                                orders: { $sum: 1 },
                                customers: { $addToSet: "$userId" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                sales: 1,
                                income: 1,
                                orders: 1,
                                customers: { $size: "$customers" }
                            }
                        },
                        {
                            $sort: { month: 1 }
                        }
                    ]
                }
            }
        ]);

        const current = summaryData[0].currentPeriod[0] || {
            totalSales: 0,
            totalIncome: 0,
            totalOrders: 0,
            totalCustomers: 0
        };

        const currentYearData = summaryData[0].currentYearMonthly || [];
        const previousYearData = summaryData[0].previousYearMonthly || [];

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedCurrentYearData = [];
        const formattedPreviousYearData = [];

        const currentMonth = new Date().getMonth();

        for (let i = 0; i < 12; i++) {
            if (i <= currentMonth) {
                const monthData = currentYearData.find(item => item.month === i + 1);

                formattedCurrentYearData.push({
                    monthName: monthNames[i],
                    monthNumber: i + 1,
                    sales: monthData ? monthData.sales : 0,
                    income: monthData ? monthData.income : 0,
                    orders: monthData ? monthData.orders : 0,
                    customers: monthData ? monthData.customers : 0
                });
            }
        }

        for (let i = 0; i < 12; i++) {
            const monthData = previousYearData.find(item => item.month === i + 1);

            formattedPreviousYearData.push({
                monthName: monthNames[i],
                monthNumber: i + 1,
                sales: monthData ? monthData.sales : 0,
                income: monthData ? monthData.income : 0,
                orders: monthData ? monthData.orders : 0,
                customers: monthData ? monthData.customers : 0
            });
        }

        const response = {
            totalSales: current.totalSales,
            totalIncome: current.totalIncome,
            totalOrders: current.totalOrders,
            totalCustomers: current.totalCustomers,
            currentYear: {
                year: currentYear,
                monthlyData: formattedCurrentYearData
            },
            previousYear: {
                year: previousYear,
                monthlyData: formattedPreviousYearData
            }
        };

        return res.status(200).json({ status: 200, message: "Dashboard Summary Data Found Successfully...", data: response });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getOrderSummary = async (req, res) => {
    try {
        const { timeframe, year, month } = req.query;
        const { startDate, endDate } = getDateRange(timeframe, year, month);

        const summary = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$count" },
                    statuses: { $push: { status: "$_id", count: "$count" } }
                }
            },
            {
                $unwind: "$statuses"
            },
            {
                $project: {
                    status: "$statuses.status",
                    percentage: {
                        $round: [{
                            $multiply: [
                                { $divide: ["$statuses.count", "$total"] },
                                100
                            ]
                        }, 0]
                    }
                }
            }
        ]);

        const formattedSummary = {
            onDelivery: 0,
            pending: 0,
            delivered: 0,
            cancelled: 0
        };

        summary.forEach(item => {
            switch (item.status) {
                case 'outForDelivery':
                    formattedSummary.onDelivery = item.percentage;
                    break;
                case 'Confirmed':
                    formattedSummary.pending = item.percentage;
                    break;
                case 'Delivered':
                    formattedSummary.delivered = item.percentage;
                    break;
                case 'Cancelled':
                    formattedSummary.cancelled = item.percentage;
                    break;
            }
        });

        const totalPercentage = Object.values(formattedSummary).reduce((sum, value) => sum + value, 0);

        if (totalPercentage > 0 && totalPercentage !== 100) {
            const factor = 100 / totalPercentage;
            for (const key in formattedSummary) {
                formattedSummary[key] = Math.round(formattedSummary[key] * factor);
            }
        }

        return res.json({ status: 200, message: "Order Summary Found SuccessFully...", data: formattedSummary });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "productvariants",
                    localField: "items.productVariantId",
                    foreignField: "_id",
                    as: "variant"
                }
            },
            { $unwind: "$variant" },
            {
                $lookup: {
                    from: "products",
                    localField: "variant.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "ratingandreviews",
                    localField: "items.productVariantId",
                    foreignField: "productVariantId",
                    as: "reviews"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "product.subCategoryId",
                    foreignField: "_id",
                    as: "subCategoriesData"
                }
            },
            {
                $unwind: {
                    path: "$reviews",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$items.productVariantId",
                    productName: { $first: "$product.productName" },
                    price: { $first: "$variant.discountPrice" },
                    categoryName: { $first: { $arrayElemAt: ["$categoryData.categoryName", 0] } },
                    subCategoryName: { $first: { $arrayElemAt: ["$subCategoriesData.subCategoryName", 0] } },
                    images: { $first: "$variant.images" },
                    totalOrders: { $sum: 1 },
                    avgRating: {
                        $avg: {
                            $toDouble: { $ifNull: ["$reviews.rating", "0"] }
                        }
                    }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    productName: 1,
                    price: 1,
                    categoryName: 1,
                    subCategoryName: 1,
                    images: 1,
                    rating: { $round: ["$avgRating", 1] }
                }
            }
        ]);

        return res.status(200).json({ status: 200, message: "Top Products Found SuccessFully...", data: topProducts });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getSalesByLocation = async (req, res) => {
    try {
        const { timeframe, year, month } = req.query;

        const { startDate, endDate } = getDateRange(timeframe, year, month);

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;

        const salesData = await Order.aggregate([
            {
                $facet: {
                    currentPeriod: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: startDate,
                                    $lte: endDate
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$addressId",
                                totalSales: {
                                    $sum: "$totalAmount"
                                },
                                orderCount: { $sum: 1 },
                            }
                        },
                        {
                            $lookup: {
                                from: "addresses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "address"
                            }
                        },
                        { $unwind: "$address" },
                        {
                            $project: {
                                _id: 0,
                                totalSales: 1,
                                orderCount: 1,
                                city: "$address.city",
                                state: "$address.state",
                                country: "$address.country"
                            }
                        },
                        { $sort: { totalSales: -1 } }
                    ],

                    currentYearMonthly: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${currentYear}-01-01`),
                                    $lte: new Date()
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    addressId: "$addressId",
                                    month: { $month: "$createdAt" }
                                },
                                totalSales: { $sum: "$totalAmount" },
                                orderCount: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "addresses",
                                localField: "_id.addressId",
                                foreignField: "_id",
                                as: "address"
                            }
                        },
                        { $unwind: "$address" },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                city: "$address.city",
                                state: "$address.state",
                                country: "$address.country",
                                totalSales: 1,
                                orderCount: 1
                            }
                        },
                        { $sort: { city: 1, month: 1 } }
                    ],

                    previousYearMonthly: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${previousYear}-01-01`),
                                    $lte: new Date(`${previousYear}-12-31`)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    addressId: "$addressId",
                                    month: { $month: "$createdAt" }
                                },
                                totalSales: { $sum: "$totalAmount" },
                                orderCount: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "addresses",
                                localField: "_id.addressId",
                                foreignField: "_id",
                                as: "address"
                            }
                        },
                        { $unwind: "$address" },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                city: "$address.city",
                                state: "$address.state",
                                country: "$address.country",
                                totalSales: 1,
                                orderCount: 1
                            }
                        },
                        { $sort: { city: 1, month: 1 } }
                    ],

                    yearlyAverages: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${previousYear}-01-01`),
                                    $lte: new Date(`${previousYear}-12-31`)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    addressId: "$addressId",
                                    month: { $month: "$createdAt" }
                                },
                                monthlySales: { $sum: "$totalAmount" },
                                monthlyOrders: { $sum: 1 }
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.addressId",
                                avgMonthlySales: { $avg: "$monthlySales" },
                                avgMonthlyOrders: { $avg: "$monthlyOrders" },
                                monthsWithData: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "addresses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "address"
                            }
                        },
                        { $unwind: "$address" },
                        {
                            $project: {
                                _id: 0,
                                city: "$address.city",
                                state: "$address.state",
                                country: "$address.country",
                                avgMonthlySales: 1,
                                avgMonthlyOrders: 1,
                                monthsWithData: 1
                            }
                        },
                        { $sort: { avgMonthlySales: -1 } }
                    ]
                }
            }
        ]);

        const currentPeriodData = salesData[0].currentPeriod || [];
        const currentYearMonthlyData = salesData[0].currentYearMonthly || [];
        const previousYearMonthlyData = salesData[0].previousYearMonthly || [];
        const yearlyAverages = salesData[0].yearlyAverages || [];

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = new Date().getMonth();

        const allCities = new Set();
        [...currentPeriodData, ...currentYearMonthlyData, ...previousYearMonthlyData, ...yearlyAverages].forEach(item => {
            if (item.city) {
                allCities.add(item.city);
            }
        });

        const formattedCurrentYearData = {};
        Array.from(allCities).forEach(city => {
            formattedCurrentYearData[city] = Array(currentMonth + 1).fill().map((_, i) => {
                const monthData = currentYearMonthlyData.find(item => item.city === city && item.month === i + 1);
                return {
                    monthName: monthNames[i],
                    monthNumber: i + 1,
                    totalSales: monthData ? monthData.totalSales : 0,
                    orderCount: monthData ? monthData.orderCount : 0
                };
            });
        });

        const formattedPreviousYearData = {};
        Array.from(allCities).forEach(city => {
            formattedPreviousYearData[city] = Array(12).fill().map((_, i) => {
                const monthData = previousYearMonthlyData.find(item => item.city === city && item.month === i + 1);
                return {
                    monthName: monthNames[i],
                    monthNumber: i + 1,
                    totalSales: monthData ? monthData.totalSales : 0,
                    orderCount: monthData ? monthData.orderCount : 0
                };
            });
        });

        const formattedYearlyAverages = {};
        yearlyAverages.forEach(item => {
            formattedYearlyAverages[item.city] = {
                avgMonthlySales: item.avgMonthlySales,
                avgMonthlyOrders: item.avgMonthlyOrders,
                monthsWithData: item.monthsWithData
            };
        });

        const response = {
            currentPeriod: currentPeriodData,
            yearlyAverages: formattedYearlyAverages,
            currentYear: {
                year: currentYear,
                monthlyDataByCity: formattedCurrentYearData
            },
            previousYear: {
                year: previousYear,
                monthlyDataByCity: formattedPreviousYearData
            }
        };

        return res.status(200).json({ status: 200, message: "Sales by Location Data Found Successfully...", data: response });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        let getAllReviews = await review.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $limit: 5
            }
        ]);

        return res.status(200).json({ status: 200, message: "Reviews Found Successfully...", data: getAllReviews });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}