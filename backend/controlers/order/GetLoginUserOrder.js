let     Order = require('../../models/orderModel');

const getLoginUserOrder = async (req, res) => {
    try {
        let userId = req.user._id;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;
            let total = await Order.countDocuments({userId});
            let totalPages = Math.ceil(total / limit);

            const order = await Order.find({userId}).skip(skip).limit(limit).populate('userId', 'name email').populate('deliveryAddressId', 'name email').populate('productId', 'name price');
            res.json({ message: 'Order fetched successfully', status: 200, data: order, success: true, error: false, total, totalPages});

             }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getLoginUserOrder };



