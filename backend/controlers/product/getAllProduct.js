let Carsole = require('../../models/CarsoleModel');
let Product = require('../../models/productModel');

const getAllProduct = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;

        let products = await Product.find().skip(skip).limit(limit);

        // Calculate average rating for each product
        let productsWithRating = products.map(product => {
            let productObj = product.toObject();

            // Calculate average rating from comments
            if (productObj.comments && productObj.comments.length > 0) {
                let totalRating = productObj.comments.reduce((sum, comment) => {
                    return sum + (comment.rating || 0);
                }, 0);
                productObj.averageRating = (totalRating / productObj.comments.length).toFixed(2);
                productObj.totalReviews = productObj.comments.length;
            } else {
                productObj.averageRating = 0;
                productObj.totalReviews = 0;
            }

            return productObj;
        });

        res.json({ message: 'Product fetched successfully', status: 200, data: productsWithRating, success: true, error: false,total: products.length });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllProduct };


