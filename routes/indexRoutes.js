const express = require('express');
const { createNewUser, getAllUsers, createNewUserAdmin, getUserById, updateUserById, activeUserAccount, deactiveAccoutOtpVerify, activeAccoutOtpVerify, resendOtpDeactiveAccount, resendOtpActiveAccount, deactiveUserAccount, deleteUserById } = require('../controller/userController');
const { verifyOtp, userLogin, forgotPassword, changePassword, adminLogin, updatePassword, getAllDeactiveUser } = require('../auth/userLogin');
const { createMainCategory, getAllMainCategory, getMainCategoryById, updateMainCategoryById, deleteMainCategoryById } = require('../controller/mainCategoryController');
const upload = require('../helper/imageUplode');
const { createCategory, getAllCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controller/categoryController');
const { createSubCategory, getAllSubCategory, getSubCategoryById, updateSubCategoryById, deleteSubCategoryById } = require('../controller/subCategoryController');
const { createAddress, getAllAddress, getAddressById, updateAddressById, deleteAddressById, getAllMyAddress } = require('../controller/addressController');
const { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } = require('../controller/productController');
const { createProductVariant, getAllProductVariant, getProductVarinatById, updateProductVariantById, deleteProducVariant, updateProductStatusById } = require('../controller/productVariantController');
const { createWishList, getAllWishList, getWishListById, deleteWishlListById, getMyWishListById } = require('../controller/wishlistController');
const { createSpecialOffer, getAllSpecialOffer, getSpecialOfferById, updateSpecialOfferById, deleteSpecialOfferById } = require('../controller/specialOfferController');
const { createPaymentMethod, getAllCardData, getAllMyPaymentData, updatePaymentdataById, deletePaymentDataById } = require('../controller/paymentMethodController');
const { auth } = require('../helper/authToken');
const { createOrder, getAllOrders, getOrderById, updateOrderById, updateOrderItemQuantityById, deleteOrderItemById, deleteOrderById, getAllMyOrders } = require('../controller/orderController');
const { createRatingAndReview, getAllRatingAndReview, getRatingAndReviewById, updateRatingAndReview, deleteRaingAndReviewById, getMyRatingAndReview } = require('../controller/ratingAndReviewController');
const { createReturnOrder, returnOrderVerifyOtp, getAllReturnOrder, getReturnOrderDataById, changeReturnOrderStatusById, getAllMyReturnOrderData } = require('../controller/returnOrderController');
const { createContactUs, getAllContactUs, getContactUsById, deleteContactUsById } = require('../controller/contactUsController');
const { createSize, getAllSizes, getSizeDataById, updateSizeDataById, deleteSizeDataById } = require('../controller/sizeController');
const { createUnit, getAllUnit, getUnitDataById, updateUnitDataById, deleteUnitDataById } = require('../controller/unitController');
const { createStock, getAllStockReport, getStockDataById, updateStockDataById, deleteStockDataById } = require('../controller/stockController');
const { createTermsAndConditions, getAllTermsAndConditions, getTermsAndConditionById, updateTermsAndConditionById, deleteTermsAndConditionById } = require('../controller/termsAndConditionsController');
const { createFAQ, getAllFaqs, getFaqById, updateFaqById, deleteFaqById } = require('../controller/FAQController');
const { createAccountPolicy, getAllAccountPolicy, getAccountPolicyById, updateAcountPolicy, deleteAccountPolicy } = require('../controller/accountPolicyController');
const { createHelpQuestion, getAllHelpQuestions, getHelpQuestionById, updateHelpQuestionById, deleteHelpQuestionById } = require('../controller/helpController');
const { createAboutUs, getAllAboutUs, getAboutUsById, updateAboutUsById, deleteAboutUsById } = require('../controller/aboutUsController');
const { createCard, getAllCardTitles, getCardTitleById, updateCardTitleById, deleteCardTitleById } = require('../controller/cardController');
const { createPopularBrands, getAllPopularBrands, getBrandById, updateBrandById, deletePopularBrandById } = require('../controller/popularBrandsController');
const { createProductOffer, getAllProductOffer, getProductOfferById, updateProductOfferById, deleteProductOfferById } = require('../controller/productOfferController');
const { createOffer, getAllOffers, getOffersById, updateOfferById, deleteOfferById } = require('../controller/offerController');
const { createReason, getAllReason, getReasonById, updateReasonById, deleteReasonById } = require('../controller/reasonOfCancellationController');
const { createCancelOrder, getAllCancelledOrders, getCancelledOrderById } = require('../controller/cancelOrderController');
const { getDashboardSummary, getOrderSummary, getTopProducts, getSalesByLocation, getAllReviews } = require('../controller/dashboardController');
const indexRoutes = express.Router();

// Auth Routes

indexRoutes.post('/login', userLogin)
indexRoutes.post('/adminLogin', adminLogin)
indexRoutes.post('/verifyOtp', verifyOtp)
indexRoutes.post('/forgotPassword', forgotPassword)
indexRoutes.post('/resetPassword/:id', changePassword)
indexRoutes.put('/updatePassword', auth(['admin', 'user']), updatePassword)

// Dashboard Routes 

indexRoutes.get('/dashboardSummury', auth(['admin']), getDashboardSummary)
indexRoutes.get('/orderSummary', auth(['admin']), getOrderSummary)
indexRoutes.get('/topProducts', auth(['admin']), getTopProducts)
indexRoutes.get('/salesByLocation', auth(['admin']), getSalesByLocation)
indexRoutes.get('/allReviews', auth(['admin']), getAllReviews)

// User Routes Routes

indexRoutes.post('/createadmin', createNewUserAdmin);
indexRoutes.post('/createUser', createNewUser);
indexRoutes.get('/getAllUsers', auth(['admin']), getAllUsers);
indexRoutes.get('/getUser', auth(['admin', 'user']), getUserById);
indexRoutes.put('/updateUser', auth(['admin', 'user']), upload.single('image'), updateUserById);
indexRoutes.get('/deactiveUser', auth(['user']), deactiveUserAccount);
indexRoutes.get('/deactiveAccountOtpVerify', auth(['user']), deactiveAccoutOtpVerify);
indexRoutes.get('/activeUserAccount', auth(['user']), activeUserAccount);
indexRoutes.get('/activeAccountOtpVerify', auth(['user']), activeAccoutOtpVerify);
indexRoutes.get('/resendOtpDeactiveAccount', auth(['user']), resendOtpDeactiveAccount);
indexRoutes.get('/resendOtpActiveAccount', auth(['user']), resendOtpActiveAccount);
indexRoutes.get('/allDeactiveUserAccount', auth(['admin']), getAllDeactiveUser)
indexRoutes.delete('/deleteUser/:id', auth(['admin']), deleteUserById)

// Main Category Routes

indexRoutes.post('/createMaincategory', auth(['admin']), upload.single('mainCategoryImage'), createMainCategory);
indexRoutes.get('/allMainCategory', auth(['admin', 'user']), getAllMainCategory);
indexRoutes.get('/getMainCategory/:id', auth(['admin', 'user']), getMainCategoryById);
indexRoutes.put('/updateMainCategory/:id', auth(['admin']), upload.single('mainCategoryImage'), updateMainCategoryById);
indexRoutes.delete('/deleteMainCategory/:id', auth(['admin']), deleteMainCategoryById)

// Category Routes

indexRoutes.post('/createCategory', auth(['admin']), createCategory);
indexRoutes.get('/allCategory', auth(['admin', 'user']), getAllCategory);
indexRoutes.get('/getCategory/:id', auth(['admin', 'user']), getCategoryById);
indexRoutes.put('/updateCategry/:id', auth(['admin']), updateCategoryById);
indexRoutes.delete('/deleteCategory/:id', auth(['admin']), deleteCategoryById);

// subCategory Routes

indexRoutes.post('/createSubCategory', auth(['admin']), createSubCategory);
indexRoutes.get('/allSubCategory', auth(['admin', 'user']), getAllSubCategory);
indexRoutes.get('/getSubCategory/:id', auth(['admin', 'user']), getSubCategoryById);
indexRoutes.put('/updateSubCategory/:id', auth(['admin']), updateSubCategoryById);
indexRoutes.delete('/deleteSubCategory/:id', auth(['admin']), deleteSubCategoryById);

// address Routes

indexRoutes.post('/createAddress', auth(['user']), createAddress);
indexRoutes.get('/allAddress', auth(['admin']), getAllAddress);
indexRoutes.get('/getAddress/:id', auth(['admin', 'user']), getAddressById);
indexRoutes.put('/updateAddress/:id', auth(['admin', 'user']), updateAddressById);
indexRoutes.delete('/deleteAddress/:id', auth(['admin', 'user']), deleteAddressById);
indexRoutes.get('/getAllMyAddress', auth(['user']), getAllMyAddress);

// product Routes 

indexRoutes.post('/createProduct', auth(['admin']), upload.array('images'), createProduct);
indexRoutes.get('/allProduct', auth(['admin', 'user']), getAllProducts);
indexRoutes.get('/getProduct/:id', auth(['admin', 'user']), getProductById);
indexRoutes.put('/updateProduct/:id', auth(['admin']), upload.array('images'), updateProductById);
indexRoutes.delete('/deleteProduct/:id', auth(['admin']), deleteProductById);

// product Variant 

indexRoutes.post('/createProductVariant', auth(['admin']), upload.fields([{ name: 'images' }]), createProductVariant);
indexRoutes.get('/allProductVariant', auth(['admin', 'user']), getAllProductVariant);
indexRoutes.get('/getProductVariant/:id', auth(['admin', 'user']), getProductVarinatById)
indexRoutes.put('/updateProductVariant/:id', auth(['admin']), upload.fields([{ name: 'images' }]), updateProductVariantById);
indexRoutes.delete('/deleteProductVariant/:id', auth(['admin']), deleteProducVariant);
indexRoutes.put('/updateProductStatus/:id', auth(['admin']), updateProductStatusById);

// WishList 

indexRoutes.post('/createWishList', auth(['admin', 'user']), createWishList);
indexRoutes.get('/allwishList', auth(['admin']), getAllWishList);
indexRoutes.get('/getWishlist/:id', auth(['admin', 'user']), getWishListById);
indexRoutes.delete('/deleteWishList/:id', auth(['admin', 'user']), deleteWishlListById);
indexRoutes.get('/getMyWishList', auth(['admin', 'user']), getMyWishListById);

// special Offer

indexRoutes.post('/createSpecialOffer', auth(['admin']), createSpecialOffer);
indexRoutes.get('/allSpecialOffer', auth(['admin', 'user']), getAllSpecialOffer)
indexRoutes.get('/getSpecialOffer/:id', auth(['admin', 'user']), getSpecialOfferById);
indexRoutes.put('/updateSpecialOffer/:id', auth(['admin', 'user']), updateSpecialOfferById);
indexRoutes.delete('/deleteSpecialOffer/:id', auth(['user']), deleteSpecialOfferById);

// Payment Method Routes

indexRoutes.post('/createPaymentMethod', auth(['admin', 'user']), createPaymentMethod);
indexRoutes.get('/allCardData', auth(['admin', 'user']), getAllCardData);
indexRoutes.get('/getAllMyPayment', auth(['admin', 'user']), getAllMyPaymentData);
indexRoutes.put('/updatePaymentData/:id', auth(['admin', 'user']), updatePaymentdataById);
indexRoutes.delete('/deletePaymentData/:id', auth(['admin', 'user']), deletePaymentDataById)

// Order Routes

indexRoutes.post('/createOrder', auth(['user', 'admin']), createOrder);
indexRoutes.get('/allOrders', auth(['admin', 'user']), getAllOrders);
indexRoutes.get('/getOrder/:id', auth(['admin', 'user']), getOrderById);
indexRoutes.put('/updateOrder/:id', auth(['user']), updateOrderById);
indexRoutes.put('/updateItemQty/:id', auth(['user']), updateOrderItemQuantityById);
indexRoutes.delete('/deleteOrderItem/:id', auth(['user']), deleteOrderItemById);
indexRoutes.delete('/deleteOrder/:id', auth(['user']), deleteOrderById)
indexRoutes.get('/getAllMyOrders', auth(['user']), getAllMyOrders);

// rating And Review Routes

indexRoutes.post('/createRatingAndReview', auth(['user']), upload.fields([{ name: 'productImages' }]), createRatingAndReview);
indexRoutes.get('/allratingAndReview', auth(['admin', 'user']), getAllRatingAndReview);
indexRoutes.get('/getRatingReview/:id', auth(['admin', 'user']), getRatingAndReviewById);
indexRoutes.put('/updateRatingAndReview/:id', auth(['user']), upload.fields([{ name: 'productImages' }]), updateRatingAndReview);
indexRoutes.delete('/deleteRatingAndReview/:id', auth(['user']), deleteRaingAndReviewById);
indexRoutes.get('/getMyRating', auth(['user']), getMyRatingAndReview);

// return Order Routes

indexRoutes.post('/generateReturnOrderOtp', auth(['user']), createReturnOrder);
indexRoutes.post('/verifyReturnOrderOtp', auth(['user']), returnOrderVerifyOtp);
indexRoutes.get('/allReturnOrders', auth(['admin', 'user']), getAllReturnOrder);
indexRoutes.get('/getReturnOrder/:id', auth(['admin', 'user']), getReturnOrderDataById);
indexRoutes.put('/changeReturnOrderStatus/:id', auth(['admin']), changeReturnOrderStatusById);
indexRoutes.get('/getMyReturnOrders', auth(['user']), getAllMyReturnOrderData);

// contctUs Routes

indexRoutes.post('/createContctUs', auth(['user']), createContactUs);
indexRoutes.get('/allContactUs', auth(['admin']), getAllContactUs);
indexRoutes.get('/getContactUs/:id', auth(['admin']), getContactUsById);
indexRoutes.delete('/deleteContactUs/:id', auth(['admin']), deleteContactUsById);

// Size Routes 

indexRoutes.post('/createSize', auth(['admin']), createSize);
indexRoutes.get('/allSizes', auth(['admin', 'user']), getAllSizes);
indexRoutes.get('/getSizeData/:id', auth(['admin', 'user']), getSizeDataById)
indexRoutes.put('/updateSize/:id', auth(['admin']), updateSizeDataById)
indexRoutes.delete('/deleteSize/:id', auth(['admin']), deleteSizeDataById)

// unit routes

indexRoutes.post('/createUnit', auth(['admin']), createUnit);
indexRoutes.get('/allUnits', auth(['admin', 'user']), getAllUnit);
indexRoutes.get('/getUnit/:id', auth(['admin', 'user']), getUnitDataById)
indexRoutes.put('/updateUnit/:id', auth(['admin']), updateUnitDataById)
indexRoutes.delete('/deleteUnit/:id', auth(['admin']), deleteUnitDataById)

// stock Routs

indexRoutes.post('/createStock', auth(['admin']), createStock);
indexRoutes.get('/allStocks', auth(['admin']), getAllStockReport)
indexRoutes.get('/getStock/:id', auth(['admin']), getStockDataById)
indexRoutes.put('/updateStock/:id', auth(['admin']), updateStockDataById)
indexRoutes.delete('/deleteStock/:id', auth(['admin']), deleteStockDataById)

// Terms And Conditions Routes

indexRoutes.post('/createTerms', auth(['admin']), createTermsAndConditions);
indexRoutes.get('/allTerms', auth(['admin', 'user']), getAllTermsAndConditions);
indexRoutes.get('/getTerms/:id', auth(['admin', 'user']), getTermsAndConditionById);
indexRoutes.put('/updateTerm/:id', auth(['admin']), updateTermsAndConditionById);
indexRoutes.delete('/deleteTerm/:id', auth(['admin']), deleteTermsAndConditionById);

// FAQ Routes

indexRoutes.post('/createFaq', auth(['admin']), createFAQ);
indexRoutes.get('/allFaqs', auth(['admin', 'user']), getAllFaqs);
indexRoutes.get('/getFaq/:id', auth(['admin', 'user']), getFaqById);
indexRoutes.put('/updateFaq/:id', auth(['admin']), updateFaqById);
indexRoutes.delete('/deleteFaq/:id', auth(['admin']), deleteFaqById)

// Account Policy Routes 

indexRoutes.post('/createPolicy', auth(['admin']), createAccountPolicy);
indexRoutes.get('/allPolicy', auth(['admin', 'user']), getAllAccountPolicy)
indexRoutes.get('/getPolicy/:id', auth(['admin', 'user']), getAccountPolicyById)
indexRoutes.put('/updatePolicy/:id', auth(['admin']), updateAcountPolicy)
indexRoutes.delete('/deletePolicy/:id', auth(['admin']), deleteAccountPolicy)

// Help Question Routes

indexRoutes.post('/createHelpQuestion', auth(['admin']), createHelpQuestion)
indexRoutes.get('/allHelpQuestions', auth(['admin', 'user']), getAllHelpQuestions)
indexRoutes.get('/getHelpQuestion/:id', auth(['admin', 'user']), getHelpQuestionById)
indexRoutes.put('/updateHelpQuestion/:id', auth(['admin']), updateHelpQuestionById)
indexRoutes.delete('/deleteHelpQuestion/:id', auth(['admin']), deleteHelpQuestionById)

// aboutUs Routes

indexRoutes.post('/createAboutUs', auth(['admin']), upload.single('aboutUsImage'), createAboutUs);
indexRoutes.get('/allAboutUs', auth(['admin', 'user']), getAllAboutUs)
indexRoutes.get('/getAboutUs/:id', auth(['admin', 'user']), getAboutUsById)
indexRoutes.put('/updateAboutUs/:id', auth(['admin']), upload.single('aboutUsImage'), updateAboutUsById);
indexRoutes.delete('/deleteAboutUs/:id', auth(['admin']), deleteAboutUsById);

// Card Routes

indexRoutes.post('/createCard', auth(['admin']), upload.single('cardImage'), createCard);
indexRoutes.get('/allCards', auth(['admin', 'user']), getAllCardTitles)
indexRoutes.get('/getCard/:id', auth(['admin', 'user']), getCardTitleById);
indexRoutes.put('/updateCard/:id', auth(['admin']), upload.single('cardImage'), updateCardTitleById)
indexRoutes.delete('/deleteCard/:id', auth(['admin']), deleteCardTitleById)

// Popular Brands 

indexRoutes.post('/createPopularBrand', auth(['admin']), upload.fields([{ name: 'brandLogo' }, { name: "brandImage" }]), createPopularBrands);
indexRoutes.get('/getAllBrands', auth(['admin', 'user']), getAllPopularBrands);
indexRoutes.get('/getBrand/:id', auth(['admin', 'user']), getBrandById);
indexRoutes.put('/updateBrand/:id', auth(['admin']), upload.fields([{ name: 'brandLogo' }, { name: "brandImage" }]), updateBrandById);
indexRoutes.delete('/deleteBrand/:id', auth(['admin']), deletePopularBrandById)

// Product Offer Routes

indexRoutes.post('/createProductOffer', auth(['admin']), createProductOffer)
indexRoutes.get('/allProductOffer', auth(['admin', 'user']), getAllProductOffer)
indexRoutes.get('/getProductOffer/:id', auth(['admin', 'user']), getProductOfferById)
indexRoutes.put('/updateProductOffer/:id', auth(['admin']), updateProductOfferById)
indexRoutes.delete('/deleteProductOffer/:id', auth(['admin']), deleteProductOfferById)

// Offer Routes

indexRoutes.post('/createOffer', auth(['admin']), upload.single('offerImage'), createOffer)
indexRoutes.get('/getAllOffers', auth(['admin', 'user']), getAllOffers)
indexRoutes.get('/getOffer/:id', auth(['admin', 'user']), getOffersById)
indexRoutes.put('/updateOffer/:id', auth(['admin']), upload.single('offerImage'), updateOfferById)
indexRoutes.delete('/deleteOffer/:id', auth(['admin']), deleteOfferById)

// Reason Of Cancellation Routes

indexRoutes.post('/createReason', auth(['admin']), createReason);
indexRoutes.get('/allReasons', auth(['admin', 'user']), getAllReason)
indexRoutes.get('/getReason/:id', auth(['admin', 'user']), getReasonById)
indexRoutes.put('/updateReason/:id', auth(['admin']), updateReasonById)
indexRoutes.delete('/deleteReason/:id', auth(['admin']), deleteReasonById);

// Cancelle Order Routes

indexRoutes.post('/cancelleOrder', auth(['admin']), createCancelOrder)
indexRoutes.get('/allCancellOrders', auth(['admin']), getAllCancelledOrders)
indexRoutes.get('/getCancelledOrder/:id', auth(['admin']), getCancelledOrderById)

module.exports = indexRoutes
