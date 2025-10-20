let router = require('express').Router();
 let cookieParser = require('cookie-parser');
  let authGuard = require('../middleware/auth');
const { SignupRout } = require('../controlers/auth/signup');
const { LogoutRout } = require('../controlers/auth/logout');
const { createCarsole } = require('../controlers/carsole/createCarsole');
const { getCarsole } = require('../controlers/carsole/getCarsole');
const { updateCarsole } = require('../controlers/carsole/updateCarsole');
const { deleteCarsole } = require('../controlers/carsole/deleteCarsole'); 
const { createProduct } = require('../controlers/product/createProduct');
const { getAllProduct } = require('../controlers/product/getAllProduct');
const { getSpecificProduct } = require('../controlers/product/getSpecificProduct');
const { updateProduct } = require('../controlers/product/updateProduct');
const { deleteProduct } = require('../controlers/product/deleteProduct');
const { createComments } = require('../controlers/product/craeteComments');
const { queryProduct } = require('../controlers/product/queryProduct');
const { createProductFAQ } = require('../controlers/product/createProductFAQ');
const { getSpacificFAQ } = require('../controlers/product/getSpacificFAQ');
const { updateProductFAQ } = require('../controlers/product/updateProductFAQ');
const { deleteProductFAQ } = require('../controlers/product/deleteFAQ');
const { adminAllUserView } = require('../controlers/users/adminAllUserView');
const { AdminSpecificUserView } = require('../controlers/users/AdminSpecificUserView');
const { AdminRoleUpdate } = require('../controlers/users/AdminRoleUpdate');
const { deleteUser } = require('../controlers/users/deleteUser');
const { queryAdminUser } = require('../controlers/users/queryUserModel');
const { createDeliveryAddress } = require('../controlers/deliveryAddress/createDeliveryAddress');
const { getAllDeliveryAdderss } = require('../controlers/deliveryAddress/getAllDeliveryAdderss');
const { getSpecificUserAddrressMannegerAndEmployeView } = require('../controlers/deliveryAddress/getSpecificUserAddrressMannegerAndEmployeView');
const { updateAddress } = require('../controlers/deliveryAddress/updateAddress');
const { deleteDeliveryAddress } = require('../controlers/deliveryAddress/deleteDeliveryAddress');
const { createCart } = require('../controlers/cart/createCart');
const { getAllCart } = require('../controlers/cart/getAllCart');
const { updateCart } = require('../controlers/cart/updateCart');
const { deleteCart } = require('../controlers/cart/deleteCart');
const { createContact } = require('../controlers/contact/createContact');
const { getContact } = require('../controlers/contact/getContactData');
const { getSpecificContact } = require('../controlers/contact/getSpecificContact');
const { updateContact } = require('../controlers/contact/updateContact');
const { deleteContact } = require('../controlers/contact/DeleteContact');
const { queryContact } = require('../controlers/contact/queryContact');
const {createOrder}=require('../controlers/order/createOrder');
const { getLoginUserOrder } = require('../controlers/order/GetLoginUserOrder');
const { getAllPendingOrder } = require('../controlers/order/getAllPendingOrder');
const { getAllAcceptedOrder } = require('../controlers/order/getAllAcceptedOrder');
const { getAllShiftedOrder } = require('../controlers/order/getAllshiftedOrder');
// const { getAllDeliveredOrder } = require('../controlers/order/getAllDeliveredOrder');
const { getAllCancelOrder } = require('../controlers/order/getAllCancelOrder');
const { updateOrderStatus } = require('../controlers/order/UpdateOrderStatusMannegerAndAdmin');
const { updateOrderStatusEmploye } = require('../controlers/order/updateOrderStatusEmploye');
const { createBlog } = require('../controlers/blogs/createBlog');
const { getAllBlog } = require('../controlers/blogs/getAllBlog');
const { getSpecificBlog } = require('../controlers/blogs/getSpecificBlog');
const { updateBlog } = require('../controlers/blogs/updateBlog');
const { deleteBlog } = require('../controlers/blogs/deleteBlogs');
const { getQueryBlog } = require('../controlers/blogs/getQueryBlog');
const { updateOrder } = require('../controlers/order/updateOrder');
const { getSpecificCarsole } = require('../controlers/carsole/getSpecificCarsole');
 
 cookieParser();


// ceate user
 router.post('/signup', SignupRout );
 router.get('/logout', LogoutRout);

//  carsole
router.post('/createCarsole', authGuard, createCarsole);
router.get('/getAllCarsole', getCarsole);
router.get('/getSpecificCarsole/:id', getSpecificCarsole );
router.put('/updateCarsole/:id', authGuard, updateCarsole);
router.delete('/deleteCarsole/:id', authGuard, deleteCarsole);

// product
router.post('/createProduct', authGuard, createProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getSpecificProduct/:id', getSpecificProduct );
router.put('/updateProduct/:id', authGuard, updateProduct);
router.delete('/deleteProduct/:id', authGuard, deleteProduct);
router.post('/createComments/:id',authGuard, createComments);
router.get('/queryProduct', queryProduct);
// product FAQ
router.post('/createProductFAQ/:id', authGuard, createProductFAQ);
router.get('/getSpacificFAQ/:id', getSpacificFAQ);
router.put('/updateProductFAQ/:id/:faqId', authGuard, updateProductFAQ);
router.delete('/deleteProductFAQ/:id/:faqId', authGuard, deleteProductFAQ);



// user information
router.get('/adminAllUserView', authGuard, adminAllUserView);
router.get('/AdminSpecificUserView/:id', authGuard, AdminSpecificUserView);
router.put('/AdminRoleUpdate/:id', authGuard, AdminRoleUpdate);
router.delete('/deleteUser/:id', authGuard, deleteUser);
router.get('/queryAdminUser', authGuard, queryAdminUser);


// delivery Address
router.post('/createDeliveryAddress', authGuard, createDeliveryAddress);
router.get('/getAllDeliveryAdderss', authGuard, getAllDeliveryAdderss);
router.get('/getSpecificUserAddrressMannegerAndEmployeView/:id', authGuard, getSpecificUserAddrressMannegerAndEmployeView);
router.put('/updateAddress/:id', authGuard, updateAddress);
router.delete('/deleteDeliveryAddress/:id', authGuard, deleteDeliveryAddress);

 
// cart
router.post('/createCart', authGuard, createCart);
router.get('/getAllCart', authGuard, getAllCart);
router.put('/updateCart/:id', authGuard, updateCart);
router.delete('/deleteCart/:id', authGuard, deleteCart);

// order
router.post('/createOrder', authGuard, createOrder);
router.get('/getLoginUserOrder', authGuard, getLoginUserOrder);
router.get('/getAllPendingOrder', authGuard, getAllPendingOrder);
router.get('/getAllAcceptedOrder', authGuard, getAllAcceptedOrder);
router.get('/getAllShiftedOrder', authGuard, getAllShiftedOrder);
// router.get('/getAllDeliveredOrder', authGuard, getAllDeliveredOrder);
router.get('/getAllCancelOrder', authGuard, getAllCancelOrder);
router.put('/updateOrderStatusByManneger/:id', authGuard, updateOrderStatus);
router.put('/updateOrderStatusByEmploye/:id', authGuard, updateOrderStatusEmploye);
router.put('/updateOrder/:id', authGuard, updateOrder);


// blog route
router.post('/createBlog', authGuard, createBlog);
router.get('/getAllBlog', getAllBlog);
router.get('/getSpecificBlog/:id', getSpecificBlog);
router.put('/updateBlog/:id', authGuard, updateBlog);
router.delete('/deleteBlog/:id', authGuard, deleteBlog);
router.get('/queryBlog', getQueryBlog);



// contact route
router.post('/createContact',authGuard, createContact);
router.get('/getContact', getContact);
router.get('/getSpecificContact/:id', getSpecificContact);
router.put('/updateContact/:id', authGuard, updateContact);
router.delete('/deleteContact/:id', authGuard, deleteContact);
router.get('/queryContact', queryContact);

// payment route



module.exports = router;