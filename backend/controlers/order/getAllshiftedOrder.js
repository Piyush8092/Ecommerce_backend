let Order = require('../../models/orderModel');

const getAllPendingOrder = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;
        let total = await Order.countDocuments({$and: [{status: 'SHIPPED'},{userId: req.user._id}] });
        let totalPages = Math.ceil(total / limit);
        if(req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const order = await Order.find({status: 'PENDING'}).skip(skip).limit(limit).populate('userId', 'name email').populate('deliveryAddressId', 'name email').populate('productId', 'name price');

        res.json({ message: 'Order fetched successfully', status: 200, data: order, success: true, error: false, total, totalPages});

             }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllPendingOrder };


