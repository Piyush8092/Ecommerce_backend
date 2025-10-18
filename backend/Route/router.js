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

 cookieParser();


// ceate user
 router.post('/signup', SignupRout );
 router.get('/logout', LogoutRout);

//  carsole
router.post('/createCarsole', authGuard, createCarsole);
router.get('/getAllCarsole', getCarsole);
router.put('/updateCarsole/:id', authGuard, updateCarsole);
router.delete('/deleteCarsole/:id', authGuard, deleteCarsole);

// product
 
router.post('/createProduct', authGuard, createProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getSpecificProduct/:id', getSpecificProduct );
router.put('/updateProduct/:id', authGuard, updateProduct);
router.delete('/deleteProduct/:id', authGuard, deleteProduct);
router.post('/createComments/:id', createComments);
router.get('/queryProduct', queryProduct);
// product FAQ
router.post('/createProductFAQ/:id', createProductFAQ);
router.get('/getSpacificFAQ/:id', getSpacificFAQ);
router.put('/updateProductFAQ/:id/:faqId', updateProductFAQ);
router.delete('/deleteProductFAQ/:id/:faqId', deleteProductFAQ);



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


module.exports = router;