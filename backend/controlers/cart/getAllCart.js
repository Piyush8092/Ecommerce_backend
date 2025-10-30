let cartModel = require('../../models/cartModel');

const getAllCart = async (req, res) => {
    try {
        let userId = req.user._id;
        let cart = await cartModel.find({userId}).populate('productId', 'name price image description catagory discount stock limit ');
        res.json({ message: 'Cart fetched successfully', status: 200, data: cart, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllCart };




