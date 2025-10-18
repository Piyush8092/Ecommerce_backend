let Cart = require('../../models/cartModel');

const getAllCart = async (req, res) => {
    try {
        let userId = req.user._id;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;
        let page = req.query.page || 1;
        let total = await Cart.countDocuments({userId});
        let totalPages = Math.ceil(total / limit);
        let cart = await Cart.find({userId}).skip(skip).limit(limit);
        res.json({ message: 'Cart fetched successfully', status: 200, data: cart, success: true, error: false, total, totalPages});

             }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllCart };




