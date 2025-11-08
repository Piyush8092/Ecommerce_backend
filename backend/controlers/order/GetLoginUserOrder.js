let Order = require('../../models/orderModel');

const getLoginUserOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Count total documents for pagination
        const total = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(total / limit);

        // Fetch orders with all related details
        const orders = await Order.find({ userId })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email')
            .populate('deliveryAddressId', 'name email phoneNo Address city state zip landmark optionalPhoneNo')
            .populate({
                path: 'productId',   // array of ObjectIds
                select: '_id name price image description'
            });

        res.status(200).json({
            message: 'Orders fetched successfully',
            status: 200,
            data: orders,
            success: true,
            error: false,
            total,
            totalPages
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something went wrong',
            status: 500,
            data: e.message,
            success: false,
            error: true
        });
    }
};

module.exports = { getLoginUserOrder };
