let Product = require('../../models/productModel');

const getPriceRange = async (req, res) => {
    try {
        let { min, max } = req.query;
        const products = await Product.find({ price: { $gte: min, $lte: max } });
        res.json({ message: 'Product fetched successfully', status: 200, data: products, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getPriceRange };



