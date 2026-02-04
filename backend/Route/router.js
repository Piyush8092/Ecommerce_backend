const express = require("express");
let router = require("express").Router();
let cookieParser = require("cookie-parser");
let authGuard = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const checkUserBlocked = require("../middleware/checkUserBlocked");
const { SignupRout } = require("../controlers/auth/signup");
const { LogoutRout } = require("../controlers/auth/logout");
const { createCarsole } = require("../controlers/carsole/createCarsole");
const { getCarsole } = require("../controlers/carsole/getCarsole");
const { updateCarsole } = require("../controlers/carsole/updateCarsole");
const { deleteCarsole } = require("../controlers/carsole/deleteCarsole");
const { createProduct } = require("../controlers/product/createProduct");
const { getAllProduct } = require("../controlers/product/getAllProduct");
const {
  getSpecificProduct,
} = require("../controlers/product/getSpecificProduct");
const { updateProduct } = require("../controlers/product/updateProduct");
const { deleteProduct } = require("../controlers/product/deleteProduct");
const {
  getProductByApprovalStatus,
} = require("../controlers/product/getProductByApprovalStatus");
const {
  getProductCountByApprovalStatus,
} = require("../controlers/product/getProductCountByApprovalStatus");
const {
  updateProductApprovalStatus,
} = require("../controlers/product/updateProductApprovalStatus");
const {
  softDeleteProduct,
} = require("../controlers/product/softDeleteProduct");
const {
  restoreSoftDeletedProduct,
} = require("../controlers/product/restoreSoftDeletedProduct");
const {
  getAllSoftDeletedProducts,
} = require("../controlers/product/getAllSoftDeletedProducts");
const { queryProduct } = require("../controlers/product/queryProduct");
const { createProductFAQ } = require("../controlers/product/createProductFAQ");
const { getSpacificFAQ } = require("../controlers/product/getSpacificFAQ");
const { updateProductFAQ } = require("../controlers/product/updateProductFAQ");
const { deleteProductFAQ } = require("../controlers/product/deleteFAQ");
const createReview = require("../controlers/review/createReview");
const getProductReviews = require("../controlers/review/getProductReviews");
const getMyProductReview = require("../controlers/review/getMyProductReview");
const getFeaturedReviews = require("../controlers/review/getFeaturedReviews");
const updateReview = require("../controlers/review/updateReview");
const deleteReview = require("../controlers/review/deleteReview");
const queryReview = require("../controlers/review/queryReview");
const toggleFeaturedReview = require("../controlers/review/toggleFeaturedReview");
const getReviewImageUploadUrl = require("../controlers/review/getReviewImageUploadUrl");
const getUserReviews = require("../controlers/review/getUserReviews");
const { adminAllUserView } = require("../controlers/users/adminAllUserView");
const {
  AdminSpecificUserView,
} = require("../controlers/users/AdminSpecificUserView");
const { AdminRoleUpdate } = require("../controlers/users/AdminRoleUpdate");
const { deleteUser } = require("../controlers/users/deleteUser");
const { queryAdminUser } = require("../controlers/users/queryUserModel");
const {
  getUserProfileImageUploadUrl,
} = require("../controlers/users/getUserProfileImageUploadUrl ");
const {
  getProductImageUploadUrl,
} = require("../controlers/product/getProductImageUploadUrl");
const {
  getCategoryImageUploadUrl,
} = require("../controlers/category/getCategoryImageUploadUrl");
const {
  getCarouselImageUploadUrl,
} = require("../controlers/carsole/getCarouselImageUploadUrl");
const {
  getBlogImageUploadUrl,
} = require("../controlers/blogs/getBlogImageUploadUrl");
const {
  createDeliveryAddress,
} = require("../controlers/deliveryAddress/createDeliveryAddress");
const {
  getAllDeliveryAdderss,
} = require("../controlers/deliveryAddress/getAllDeliveryAdderss");
const {
  getSpecificUserAddrressMannegerAndEmployeView,
} = require("../controlers/deliveryAddress/getSpecificUserAddrressMannegerAndEmployeView");
const {
  updateAddress,
} = require("../controlers/deliveryAddress/updateAddress");
const {
  deleteDeliveryAddress,
} = require("../controlers/deliveryAddress/deleteDeliveryAddress");
const { createCart } = require("../controlers/cart/createCart");
const { getAllCart } = require("../controlers/cart/getAllCart");
const { updateCart } = require("../controlers/cart/updateCart");
const { deleteCart } = require("../controlers/cart/deleteCart");
const { createContact } = require("../controlers/contact/createContact");
const { getContact } = require("../controlers/contact/getContactData");
const {
  getSpecificContact,
} = require("../controlers/contact/getSpecificContact");
const { updateContact } = require("../controlers/contact/updateContact");
const { deleteContact } = require("../controlers/contact/DeleteContact");
const { queryContact } = require("../controlers/contact/queryContact");
const { createOrder } = require("../controlers/order/createOrder");
const { getLoginUserOrder } = require("../controlers/order/GetLoginUserOrder");
const {
  getAllPendingOrder,
} = require("../controlers/order/getAllPendingOrder");
const {
  getAllAcceptedOrder,
} = require("../controlers/order/getAllAcceptedOrder");
const {
  getAllShiftedOrder,
} = require("../controlers/order/getAllshiftedOrder");
// const { getAllDeliveredOrder } = require('../controlers/order/getAllDeliveredOrder');
const { getAllCancelOrder } = require("../controlers/order/getAllCancelOrder");
const {
  updateOrderStatusEmploye,
} = require("../controlers/order/updateOrderStatusEmploye");
const {
  getTotalPendingOrderCount,
} = require("../controlers/order/getTotalPendingOrderCount");
const {
  getTotalAcceptedOrderCount,
} = require("../controlers/order/getTotalAcceptedOrderCount");
const { createBlog } = require("../controlers/blogs/createBlog");
const { getAllBlog } = require("../controlers/blogs/getAllBlog");
const { getSpecificBlog } = require("../controlers/blogs/getSpecificBlog");
const { updateBlog } = require("../controlers/blogs/updateBlog");
const { deleteBlog } = require("../controlers/blogs/deleteBlogs");
const { getQueryBlog } = require("../controlers/blogs/getQueryBlog");
const { updateOrder } = require("../controlers/order/updateOrder");
const {
  getSpecificCarsole,
} = require("../controlers/carsole/getSpecificCarsole");
const { createPayment } = require("../controlers/payment/createPayment");
const {
  getAllPaymentAdminView,
} = require("../controlers/payment/getAllPaymentAdminView");
const {
  getAllFaildPayment,
} = require("../controlers/payment/getAllFaildPayment");
const {
  getAllSuccessPayment,
} = require("../controlers/payment/getAllSuccessPayment");
const {
  getSpecificPayment,
} = require("../controlers/payment/getSpecificPayment");
const { updatePayment } = require("../controlers/payment/updatePayment");
const { deletePayment } = require("../controlers/payment/deletePayment");
const { queryPayment } = require("../controlers/payment/queryPayment");
const {
  getProductByCategory,
} = require("../controlers/product/getProductByCategory");
const {
  getNewLaunchProduct,
} = require("../controlers/product/getNewLanchProduct");
const {
  getTopSellingProduct,
} = require("../controlers/product/getTopSellingProduct");
const { updateUserSelf } = require("../controlers/users/updateUserSelf");
const { createWish } = require("../controlers/wishlist/createWish");
const { getAllWishList } = require("../controlers/wishlist/getAllWishList");
const {
  deleteFromWishList,
} = require("../controlers/wishlist/deleteFromWishList");
const {
  createSubscription,
} = require("../controlers/subscription/createSubscription");
const {
  getAllSubscription,
} = require("../controlers/subscription/getAllSubscription");
const {
  createGetInTouch,
} = require("../controlers/getInTouchAndSocalLink/createGetInTouch");
const {
  getGetInTouch,
} = require("../controlers/getInTouchAndSocalLink/getGetInTouch");
const {
  updateGetInTouch,
} = require("../controlers/getInTouchAndSocalLink/updateGetInTouch");
const { createCoupon } = require("../controlers/coupon/createCoupon");
const { getCouponByCode } = require("../controlers/coupon/getCouponByCode");
const { UsedCoupon } = require("../controlers/coupon/UsedCoupon");

const {
  createPolicyPage,
} = require("../controlers/policyPage/createPolicyPage");
const {
  getAllPolicyPages,
} = require("../controlers/policyPage/getAllPolicyPages");
const {
  getPolicyPageBySlug,
} = require("../controlers/policyPage/getPolicyPageBySlug");
const {
  updatePolicyPage,
} = require("../controlers/policyPage/updatePolicyPage");
const {
  deletePolicyPage,
} = require("../controlers/policyPage/deletePolicyPage");
const permit = require("../middleware/permit");
const { getTotalUserCount } = require("../controlers/users/getTotalUserCount");
const {
  getTotalProductCount,
} = require("../controlers/product/getTotalProductCount");
const {
  getTotalOrderCount,
} = require("../controlers/order/getTotalOrderCount");
const { getTotalBlogCount } = require("../controlers/blogs/getTotalBlogCount");
const {
  deleteSubscription,
} = require("../controlers/subscription/deleteSubscription");
const {
  deleteGetInTouch,
} = require("../controlers/getInTouchAndSocalLink/deleteGetInTouch");
const { getAllUserNames } = require("../controlers/users/getAllUserNames");
const {
  getAllEmployeeNames,
} = require("../controlers/users/getAllEmployeeNames");
const {
  getQueryDeliveryAddress,
} = require("../controlers/deliveryAddress/getQueryDeliveryAddress");
const productQueryBuilder = require("../middleware/productQueryBuilder");
const {
  getProductSearchFilters,
} = require("../controlers/product/getProductSearchFilters");
const { createCategory } = require("../controlers/category/createCategory");
const { getAllCategory } = require("../controlers/category/getAllCategory");
const {
  getSpecificCategory,
} = require("../controlers/category/getSpecificCategory");
const { updateCategory } = require("../controlers/category/updateCategory");
const { deleteCategory } = require("../controlers/category/deleteCategory");
const {
  getCategorySummary,
} = require("../controlers/category/getCategorySummary");
const { getCategoryItems } = require("../controlers/category/getCategoryItems");

// Razorpay payment controllers
const {
  createRazorpayOrder,
} = require("../controlers/payment/createRazorpayOrder");
const {
  verifyRazorpayPayment,
} = require("../controlers/payment/verifyRazorpayPayment");
const { getRazorpayKey } = require("../controlers/payment/getRazorpayKey");
const razorpayWebhook = require("../controlers/payment/razorpayWebhook");

// Shiprocket shipment controllers
const { createShipment } = require("../controlers/shipment/createShipment");
const { getShipment } = require("../controlers/shipment/getShipment");
const {
  getShipmentTracking,
} = require("../controlers/shipment/getShipmentTracking");
const {
  shiprocketWebhook,
} = require("../controlers/shipment/shiprocketWebhook");
const {
  generateShipmentLabel,
} = require("../controlers/shipment/generateShipmentLabel");
const {
  getAvailableCouriers,
} = require("../controlers/shipment/getAvailableCouriers");
const {
  checkPincodeDelivery,
} = require("../controlers/shipment/checkPincodeDelivery");

const { queryCategory } = require("../controlers/category/queryCategory");
const {
  getAllCategoryNames,
} = require("../controlers/category/getAllCategoryNames");
const { sendOtp } = require("../controlers/auth/sendOtp");
const { verifyOtp } = require("../controlers/auth/verifyOtp");
const { completeProfile } = require("../controlers/auth/completeProfile");
const {
  getAllorderAdminAndMannegerView,
} = require("../controlers/order/getAllorderAdminAndMannegerView");
const {
  getOrderByPaymentStatus,
} = require("../controlers/order/getOrderByPaymentStatus");
const {
  getOrderByShipmentStatus,
} = require("../controlers/order/getOrderByShipmentStatus");
const { queryOrder } = require("../controlers/order/queryOrder");
const {
  getAllProductNames,
} = require("../controlers/product/getAllProductNames");
const {
  getOrderByProductId,
} = require("../controlers/order/getOrderByProductId");
const {
  canUserReviewProduct,
} = require("../controlers/review/canUserReviewProduct");
const adminUpdateReviewStatus = require("../controlers/review/adminUpdateReviewStatus");
const getAllReviews = require("../controlers/review/getAllReviews");

const {
  getSpecificUserOrder,
} = require("../controlers/order/getSpecificUserOrder");
const { getNewUsersCount } = require("../controlers/users/getNewUsersCount");
const {
  adminUserStatusUpdate,
} = require("../controlers/users/adminUserStatusUpdate");
const { cancelShipment } = require("../controlers/shipment/cancelShipment");
const { requestPickup } = require("../controlers/shipment/requestPickup");
const {
  generateBatchManifest,
} = require("../controlers/shipment/generateBatchManifest");
const {
  trackMultipleShipments,
} = require("../controlers/shipment/trackMultipleShipments");
const {
  generateShipmentInvoice,
} = require("../controlers/shipment/generateShipmentInvoice");
const {
  syncShipmentStatus,
} = require("../controlers/shipment/syncShipmentStatus");
const {
  requestPickupBulk,
} = require("../controlers/shipment/requestPickupBulk");
const { cancelBulk } = require("../controlers/shipment/cancelBulk");
const { generateAWB } = require("../controlers/shipment/generateAWB");
const { getAllShipments } = require("../controlers/shipment/getAllShipments");
const { cancelOrder } = require("../controlers/order/cancelOrder");
const { cancelPickup } = require("../controlers/shipment/cancelPickup");
const { retryPickup } = require("../controlers/shipment/retryPickup");
const { getOrderByStatus } = require("../controlers/order/getOrderByStatus");
const { getSpecificOrder } = require("../controlers/order/getSpecificOrder");
const {
  updateCodSetting,
} = require("../controlers/codSetting/updateCodSetting");
const { getCodSetting } = require("../controlers/codSetting/getCodSetting");
const {
  getProductByCategoryIds,
} = require("../controlers/product/getProductByCategoryIds");
const { adminLogin } = require("../controlers/auth/adminLogin");

cookieParser();

// route's health check api
router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/check", (req, res) => res.json({ status: "CI/CD" }));

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// ceate user
router.post("/signup", SignupRout);
router.post("/adminLogin", adminLogin);
router.get("/logout", authGuard, LogoutRout);
router.post("/complete-profile", completeProfile);

//  carsole
router.post("/createCarsole", authGuard, createCarsole);
router.get("/getAllCarsole", getCarsole);
router.get("/getSpecificCarsole/:id", getSpecificCarsole);
router.put("/updateCarsole/:id", authGuard, updateCarsole);
router.delete("/deleteCarsole/:id", authGuard, deleteCarsole);
router.post("/getCarouselImageUploadUrl", authGuard, getCarouselImageUploadUrl);

// product
router.post(
  "/createProduct",
  authGuard,
  permit("ADMIN", "MANAGER"),
  createProduct
);
router.get("/getAllProduct", getAllProduct);
router.get("/getSpecificProduct/:id", getSpecificProduct);
router.put(
  "/updateProduct/:id",
  authGuard,
  permit("ADMIN", "MANAGER"),
  updateProduct
);
router.delete("/deleteProduct/:id", authGuard, deleteProduct);
router.get("/getProductByApprovalStatus", authGuard, permit("ADMIN"), getProductByApprovalStatus);
router.get(
  "/getProductCountByApprovalStatus",
  authGuard,
  permit("ADMIN"),
  getProductCountByApprovalStatus
);
router.patch(
  "/updateProductApprovalStatus/:id",
  authGuard,
  permit("ADMIN"),
  updateProductApprovalStatus
);
router.patch(
  "/softDeleteProduct/:id",
  authGuard,
  permit("ADMIN", "MANAGER"),
  softDeleteProduct
);
router.patch(
  "/restoreSoftDeletedProduct/:id",
  authGuard,
  permit("ADMIN", "MANAGER"),
  restoreSoftDeletedProduct
);
router.get(
  "/getAllSoftDeletedProducts",
  authGuard,
  permit("ADMIN", "MANAGER"),
  getAllSoftDeletedProducts
);
router.get("/queryProduct", productQueryBuilder, queryProduct);
router.get("/getProductSearchFilters", getProductSearchFilters);
router.get("/getProductByCategory/:categoryId", getProductByCategory);
router.get("/getProductByCategoryIds", getProductByCategoryIds);
// new lonch product by dataa
router.get("/new-launch-product", getNewLaunchProduct);
// top seling product // by admin => // admin will manage top selling product {topSelling: true}
router.get("/top-selling-product", getTopSellingProduct);
// total product count
router.get(
  "/getTotalProductCount",
  authGuard,
  permit("ADMIN", "MANAGER"),
  getTotalProductCount
);
router.get(
  "/getAllProductNames",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getAllProductNames
);
// product image upload URL
router.post("/getProductImageUploadUrl", authGuard, getProductImageUploadUrl);

// product FAQ
router.post("/createProductFAQ/:id", authGuard, createProductFAQ);
router.get("/getSpacificFAQ/:id", getSpacificFAQ);
router.put("/updateProductFAQ/:id/:faqId", authGuard, updateProductFAQ);
router.delete("/deleteProductFAQ/:id/:faqId", authGuard, deleteProductFAQ);

// product review
router.post("/createReview", authGuard, checkUserBlocked, createReview);
router.get("/getProductReviews/:id", optionalAuth, getProductReviews);
router.get("/getMyProductReview", authGuard, getMyProductReview);
router.get("/getFeaturedReviews", getFeaturedReviews);
router.put("/updateReview/:id", authGuard, updateReview);
router.delete("/deleteReview/:id", authGuard, deleteReview);
router.patch(
  "/adminUpdateReviewStatus/:id",
  authGuard,
  permit("ADMIN"),
  adminUpdateReviewStatus
);
router.get("/queryReview", authGuard, permit("ADMIN"), queryReview);
router.patch(
  "/toggleFeaturedReview/:id",
  authGuard,
  permit("ADMIN"),
  toggleFeaturedReview
);
router.post("/getReviewImageUploadUrl", authGuard, getReviewImageUploadUrl);
router.get("/getUserReviews", authGuard, getUserReviews);
router.get("/canUserReviewProduct/:productId", authGuard, canUserReviewProduct);
router.get("/getAllReviews", authGuard, permit("ADMIN"), getAllReviews);

// category
router.post("/createCategory", authGuard, permit("ADMIN"), createCategory);
router.get("/getAllCategory", getAllCategory);
router.get("/getSpecificCategory/:id", getSpecificCategory);
router.put("/updateCategory/:id", authGuard, permit("ADMIN"), updateCategory);
router.delete(
  "/deleteCategory/:id",
  authGuard,
  permit("ADMIN"),
  deleteCategory
);
router.get(
  "/getCategorySummary",
  authGuard,
  permit("ADMIN"),
  getCategorySummary
); // for admin dashboard
router.get("/getCategoryItems", authGuard, permit("ADMIN"), getCategoryItems);
router.get("/queryCategory", authGuard, permit("ADMIN"), queryCategory);
router.get(
  "/getAllCategoryNames",
  authGuard,
  permit("ADMIN", "MANAGER"),
  getAllCategoryNames
);
// category image upload URL
router.post(
  "/getCategoryImageUploadUrl",
  authGuard,
  permit("ADMIN"),
  getCategoryImageUploadUrl
);

// user information
router.get("/getTotalUserCount", authGuard, permit("ADMIN"), getTotalUserCount); // for admin dashboard
router.get("/getNewUsersCount", authGuard, permit("ADMIN"), getNewUsersCount); // for admin dashboard
router.get("/adminAllUserView", authGuard, adminAllUserView);
router.get("/AdminSpecificUserView/:id", authGuard, AdminSpecificUserView);
router.put("/AdminRoleUpdate/:id", authGuard, AdminRoleUpdate);
router.patch(
  "/adminUserStatusUpdate/:userId",
  authGuard,
  permit("ADMIN"),
  adminUserStatusUpdate
);
router.delete("/deleteUser/:id", authGuard, deleteUser);
router.get("/queryAdminUser", authGuard, queryAdminUser);
// update user self image add and other thing add
router.put("/updateUserSelf", authGuard, updateUserSelf);
router.get("/getAllUserNames", authGuard, permit("ADMIN"), getAllUserNames);
router.get(
  "/getAllEmployeeNames",
  authGuard,
  permit("ADMIN", "MANAGER"),
  getAllEmployeeNames
);
router.post(
  "/getUserProfileImageUploadUrl",
  authGuard,
  getUserProfileImageUploadUrl
);

// wishlist
router.post("/createWish", authGuard, createWish);
router.get("/getAllWishList", authGuard, getAllWishList);
router.delete("/deleteFromWishList", authGuard, deleteFromWishList);

// delivery Address
router.post("/createDeliveryAddress", authGuard, createDeliveryAddress);
router.get("/getAllDeliveryAdderss", authGuard, getAllDeliveryAdderss);
router.get(
  "/getSpecificUserAddrressMannegerAndEmployeView/:id",
  authGuard,
  getSpecificUserAddrressMannegerAndEmployeView
);
router.put("/updateAddress/:id", authGuard, updateAddress);
router.delete("/deleteDeliveryAddress/:id", authGuard, deleteDeliveryAddress);
router.get(
  "/queryDeliveryAddress",
  authGuard,
  permit("ADMIN"),
  getQueryDeliveryAddress
); // for admin dashboard

// cart
router.post("/createCart", authGuard, createCart);
router.get("/getAllCart", authGuard, getAllCart);
router.put("/updateCart/:id", authGuard, updateCart);
router.delete("/deleteCart/:id", authGuard, deleteCart);

// order
router.post("/createOrder", authGuard, checkUserBlocked, createOrder);
router.get("/getLoginUserOrder", authGuard, getLoginUserOrder);
router.get("/getSpecificOrder/:orderId", authGuard, getSpecificOrder);
router.get(
  "/getSpecificUserOrder/:userId",
  authGuard,
  permit("ADMIN"),
  getSpecificUserOrder
); // for admin dashboard
router.get("/getAllPendingOrder", authGuard, getAllPendingOrder);
router.get("/getAllAcceptedOrder", authGuard, getAllAcceptedOrder);
router.get("/getAllShiftedOrder", authGuard, getAllShiftedOrder);
// router.get('/getAllDeliveredOrder', authGuard, getAllDeliveredOrder);
router.get("/getOrderByPaymentStatus", authGuard, getOrderByPaymentStatus);
router.get("/getOrderByShipmentStatus", authGuard, getOrderByShipmentStatus);
router.get("/getOrderByStatus", authGuard, getOrderByStatus);
router.get(
  "/getOrderByProductId/:productId",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getOrderByProductId
); // for admin dashboard and manager dashboard
router.get("/queryOrder", authGuard, queryOrder); // for admin dashboard
router.get(
  "/getAllorderAdminAndMannegerView",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getAllorderAdminAndMannegerView
);
router.get("/getAllCancelOrder", authGuard, getAllCancelOrder);
router.put(
  "/updateOrderStatusByEmploye/:id",
  authGuard,
  updateOrderStatusEmploye
);
router.put("/updateOrder/:id", authGuard, updateOrder);
router.post("/cancelOrder/:orderId", authGuard, cancelOrder);
router.get(
  "/getTotalOrderCount",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getTotalOrderCount
); // for admin dashboard
router.get(
  "/getTotalPendingOrderCount",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getTotalPendingOrderCount
); // for admin dashboard
router.get(
  "/getTotalAcceptedOrderCount",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getTotalAcceptedOrderCount
); // for admin dashboard

// blog route
router.post("/createBlog", authGuard, createBlog);
router.get("/getAllBlog", getAllBlog);
router.get("/getSpecificBlog/:id", getSpecificBlog);
router.put("/updateBlog/:id", authGuard, updateBlog);
router.delete("/deleteBlog/:id", authGuard, deleteBlog);
router.get("/queryBlog", getQueryBlog);
router.get("/getTotalBlogCount", authGuard, permit("ADMIN"), getTotalBlogCount); // for admin dashboard
// blog image upload URL
router.post("/getBlogImageUploadUrl", authGuard, getBlogImageUploadUrl);

// contact route
router.post("/createContact", authGuard, createContact);
router.get("/getContact", getContact);
router.get("/getSpecificContact/:id", getSpecificContact);
router.put("/updateContact/:id", authGuard, updateContact);
router.delete("/deleteContact/:id", authGuard, deleteContact);
router.get("/queryContact", queryContact);

// payment route
router.post("/createPayment", authGuard, checkUserBlocked, createPayment);
router.get("/getAllPaymentAdminView", authGuard, getAllPaymentAdminView);
router.get("/getAllFaildPayment", authGuard, getAllFaildPayment);
router.get("/getAllSuccessPayment", authGuard, getAllSuccessPayment);
router.get("/getSpecificPayment/:id", authGuard, getSpecificPayment);
router.put("/updatePayment/:id", authGuard, updatePayment);
router.delete("/deletePayment/:id", authGuard, deletePayment);
router.get("/queryPayment", queryPayment); // for admin dashboard

// Razorpay payment routes
router.get("/razorpay/key", getRazorpayKey);
router.post(
  "/razorpay/create-order",
  authGuard,
  checkUserBlocked,
  createRazorpayOrder
);
router.post("/razorpay/verify-payment", authGuard, verifyRazorpayPayment);
router.post("/razorpay/webhook", razorpayWebhook); // Razorpay webhook handler

// subscription route
router.post("/createSubscription", authGuard, createSubscription);
router.get("/getAllSubscription", authGuard, getAllSubscription);
router.delete(
  "/deleteSubscription/:id",
  authGuard,
  permit("ADMIN"),
  deleteSubscription
);

// policy page route
router.post("/createPolicyPage", authGuard, permit("ADMIN"), createPolicyPage);
router.get("/getAllPolicyPages", getAllPolicyPages);
router.get("/getPolicyPageBySlug/:slug", getPolicyPageBySlug);
router.put(
  "/updatePolicyPage/:slug",
  authGuard,
  permit("ADMIN"),
  updatePolicyPage
);
router.delete(
  "/deletePolicyPage/:slug",
  authGuard,
  permit("ADMIN"),
  deletePolicyPage
);

// get in touch and social link route
router.post("/createGetInTouch", authGuard, createGetInTouch);
router.get("/getGetInTouch", getGetInTouch);
router.put("/updateGetInTouch/:id", authGuard, updateGetInTouch);
router.delete(
  "/deleteGetInTouch/:id",
  authGuard,
  permit("ADMIN"),
  deleteGetInTouch
);

// coupon route
//by admin Body=> { code: 'SAVE20', discount: 20, expiryDate: '2024-12-31T23:59:59.000Z', assignToAllUsers: true }
router.post("/createCoupon", authGuard, createCoupon);
// pass coupon code in body
router.get("/getCouponByCode", authGuard, getCouponByCode);
// pass coupon code in body update user coupon used
router.put("/UsedCoupon", authGuard, UsedCoupon);

// Shiprocket shipment routes
router.post("/webhook/shipments", shiprocketWebhook); // Public endpoint for Shiprocket webhooks
router.get("/shipments/checkPincodeDelivery", checkPincodeDelivery); // Public endpoint for Shiprocket webhooks (no auth)
router.post(
  "/shipments/:orderId/generate-awb",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  generateAWB
);
router.post(
  "/shipments/track-multiple",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  trackMultipleShipments
);
router.post(
  "/shipments/generate-batch-manifest",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  generateBatchManifest
);
router.post(
  "/shipments/cancel-bulk",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  cancelBulk
);
router.get(
  "/getAllShipments",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getAllShipments
);
router.post(
  "/shipments/:orderId",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  createShipment
);
router.get(
  "/shipments/:orderId",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getShipment
);
router.get(
  "/shipments/:orderId/tracking",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getShipmentTracking
);
router.post(
  "/shipments/:shipmentId/label",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  generateShipmentLabel
);
router.post(
  "/shipments/:shipmentId/invoice",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  generateShipmentInvoice
);
router.get(
  "/shipments/:orderId/couriers",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  getAvailableCouriers
);
router.post(
  "/shipments/:orderId/cancel",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  cancelShipment
);
router.post(
  "/shipments/:orderId/pickup",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  requestPickup
);
router.post(
  "/shipments/:shipmentId/cancel-pickup",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  cancelPickup
);
router.post(
  "/shipments/:shipmentId/retry-pickup",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  retryPickup
);
router.get("/shipments/:orderId/sync", authGuard, syncShipmentStatus);
router.post(
  "/shipments/pickup-bulk",
  authGuard,
  permit("ADMIN", "MANAGER", "EMPLOYEE"),
  requestPickupBulk
);

//COD routes
router.put("/updateCodSetting", authGuard, permit("ADMIN"), updateCodSetting);
router.get("/getCodSetting", authGuard, getCodSetting);

module.exports = router;
