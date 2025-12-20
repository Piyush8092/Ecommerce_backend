let router = require("express").Router();
let cookieParser = require("cookie-parser");
let authGuard = require("../middleware/auth");
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
const { createComments } = require("../controlers/product/craeteComments");
const { queryProduct } = require("../controlers/product/queryProduct");
const { createProductFAQ } = require("../controlers/product/createProductFAQ");
const { getSpacificFAQ } = require("../controlers/product/getSpacificFAQ");
const { updateProductFAQ } = require("../controlers/product/updateProductFAQ");
const { deleteProductFAQ } = require("../controlers/product/deleteFAQ");
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
  updateOrderStatus,
} = require("../controlers/order/UpdateOrderStatusMannegerAndAdminAndLoginUser");
const {
  updateOrderStatusEmploye,
} = require("../controlers/order/updateOrderStatusEmploye");
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
const {
  getProductByCatagory,
} = require("../controlers/product/getProductByCatagory");
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
  getProductNameAndImageByCatagory,
} = require("../controlers/product/getProductNameAndImageByCatagory");
const {
  createSubscription,
} = require("../controlers/subscription/createSubscription");
const {
  getAllSubscription,
} = require("../controlers/subscription/getAllSubscription");
const { createPrivacyPolicy } = require("../controlers/privacy/privacyCreate");
const { getPrivacyPolicy } = require("../controlers/privacy/privacyGet");
const {
  getSpecificPrivacyPolicy,
} = require("../controlers/privacy/getSpecificPrivecy");
const { editPrivacyPolicy } = require("../controlers/privacy/privecyEdit");
const { deletePrivacyPolicy } = require("../controlers/privacy/privecyDelete");
const { createTermsAndConditions } = require("../controlers/term/termCreate");
const { getTermsAndConditions } = require("../controlers/term/termGet");
const {
  getSpecificTermsAndConditions,
} = require("../controlers/term/getSpecificTerm");
const { editTermsAndConditions } = require("../controlers/term/termEdit");
const { deleteTermsAndConditions } = require("../controlers/term/termDelete");
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
const { queryCategory } = require("../controlers/category/queryCategory");
const {
  getAllCategoryNames,
} = require("../controlers/category/getAllCategoryNames");
const { sendOtp } = require("../controlers/auth/sendOtp");
const { verifyOtp } = require("../controlers/auth/verifyOtp");
const { completeProfile } = require("../controlers/auth/completeProfile");

cookieParser();

// route's health check api
router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/check", (req, res) => res.json({ status: "CI/CD" }));

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// ceate user
router.post("/signup", SignupRout);
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
router.post("/createProduct", authGuard, createProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getSpecificProduct/:id", getSpecificProduct);
router.put("/updateProduct/:id", authGuard, updateProduct);
router.delete("/deleteProduct/:id", authGuard, deleteProduct);
router.post("/createComments/:id", authGuard, createComments);
router.get("/queryProduct", productQueryBuilder, queryProduct);
router.get("/getProductSearchFilters", getProductSearchFilters);
router.get(
  "/getProductNameAndImageByCatagory",
  getProductNameAndImageByCatagory
);
router.get("/getProductByCatagory/:categoryId", getProductByCatagory);
// new lonch product by dataa
router.get("/new-launch-product", getNewLaunchProduct);
// top seling product // by admin => // admin will manage top selling product {topSelling: true}
router.get("/top-selling-product", getTopSellingProduct);
// total product count
router.get(
  "/getTotalProductCount",
  authGuard,
  permit("ADMIN"),
  getTotalProductCount
);
// product image upload URL
router.post("/getProductImageUploadUrl", authGuard, getProductImageUploadUrl);

// product FAQ
router.post("/createProductFAQ/:id", authGuard, createProductFAQ);
router.get("/getSpacificFAQ/:id", getSpacificFAQ);
router.put("/updateProductFAQ/:id/:faqId", authGuard, updateProductFAQ);
router.delete("/deleteProductFAQ/:id/:faqId", authGuard, deleteProductFAQ);

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
  permit("ADMIN"),
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
router.get("/adminAllUserView", authGuard, adminAllUserView);
router.get("/AdminSpecificUserView/:id", authGuard, AdminSpecificUserView);
router.put("/AdminRoleUpdate/:id", authGuard, AdminRoleUpdate);
router.delete("/deleteUser/:id", authGuard, deleteUser);
router.get("/queryAdminUser", authGuard, queryAdminUser);
// update user self image add and other thing add
router.put("/updateUserSelf", authGuard, updateUserSelf);
router.get("/getAllUserNames", authGuard, permit("ADMIN"), getAllUserNames);
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
router.post("/createOrder", authGuard, createOrder);
router.get("/getLoginUserOrder", authGuard, getLoginUserOrder);
router.get("/getAllPendingOrder", authGuard, getAllPendingOrder);
router.get("/getAllAcceptedOrder", authGuard, getAllAcceptedOrder);
router.get("/getAllShiftedOrder", authGuard, getAllShiftedOrder);
// router.get('/getAllDeliveredOrder', authGuard, getAllDeliveredOrder);
router.get("/getAllCancelOrder", authGuard, getAllCancelOrder);
router.put("/updateOrderStatusByManneger/:id", authGuard, updateOrderStatus);
router.put(
  "/updateOrderStatusByEmploye/:id",
  authGuard,
  updateOrderStatusEmploye
);
router.put("/updateOrder/:id", authGuard, updateOrder);
router.get(
  "/getTotalOrderCount",
  authGuard,
  permit("ADMIN"),
  getTotalOrderCount
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
router.post("/createPayment", authGuard, createPayment);
router.get("/getAllPaymentAdminView", authGuard, getAllPaymentAdminView);
router.get("/getAllFaildPayment", authGuard, getAllFaildPayment);
router.get("/getAllSuccessPayment", authGuard, getAllSuccessPayment);
router.get("/getSpecificPayment/:id", authGuard, getSpecificPayment);
router.put("/updatePayment/:id", authGuard, updatePayment);
router.delete("/deletePayment/:id", authGuard, deletePayment);

// Razorpay payment routes
router.get("/razorpay/key", getRazorpayKey);
router.post("/razorpay/create-order", authGuard, createRazorpayOrder);
router.post("/razorpay/verify-payment", authGuard, verifyRazorpayPayment);

// Shiprocket shipment routes
router.post("/shipments/create/:orderId", authGuard, createShipment);
router.get("/shipments/:orderId", authGuard, getShipment);
router.get("/shipments/:orderId/tracking", authGuard, getShipmentTracking);
router.get("/shipments/:orderId/couriers", authGuard, getAvailableCouriers);
router.post("/shipments/:orderId/label", authGuard, generateShipmentLabel);
router.post("/shipments/webhook", shiprocketWebhook); // No auth for webhook

// subscription route
router.post("/createSubscription", authGuard, createSubscription);
router.get("/getAllSubscription", authGuard, getAllSubscription);
router.delete(
  "/deleteSubscription/:id",
  authGuard,
  permit("ADMIN"),
  deleteSubscription
);

// privacy policy route
router.post("/createPrivacyPolicy", authGuard, createPrivacyPolicy);
router.get("/getPrivacyPolicy", getPrivacyPolicy);
router.get("/getSpecificPrivacyPolicy/:id", getSpecificPrivacyPolicy);
router.put("/editPrivacyPolicy/:id", authGuard, editPrivacyPolicy);
router.delete("/deletePrivacyPolicy/:id", authGuard, deletePrivacyPolicy);

// terms and conditions route
router.post("/createTermsAndConditions", authGuard, createTermsAndConditions);
router.get("/getTermsAndConditions", getTermsAndConditions);
router.get("/getSpecificTermsAndConditions/:id", getSpecificTermsAndConditions);
router.put("/editTermsAndConditions/:id", authGuard, editTermsAndConditions);
router.delete(
  "/deleteTermsAndConditions/:id",
  authGuard,
  deleteTermsAndConditions
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

module.exports = router;
