let Product = require('../../models/productModel');

const queryProduct = async (req, res) => {
    try {
        let query = req.query.query;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;
    let queryObj = {};
    if (query) {
        queryObj.name = { $regex: query, $options: 'i' };
        queryObj.description = { $regex: query, $options: 'i' };
        queryObj.catagory = { $regex: query, $options: 'i' };
        queryObj.price = { $regex: query, $options: 'i' };
        queryObj.stock = { $regex: query, $options: 'i' };
        queryObj.discount = { $regex: query, $options: 'i' };
 
    }
    let product = await Product.find(queryObj).skip(skip).limit(limit);
        res.json({ message: 'Product fetched successfully', status: 200, data: product, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { queryProduct };


