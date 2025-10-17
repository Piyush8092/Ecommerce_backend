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
 

module.exports = router;