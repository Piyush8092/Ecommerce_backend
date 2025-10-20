let Payment = require('../../models/paymentModel');

const getAllFaildPayment = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;

            let skip = (page - 1) * limit;
            let total = await Payment.countDocuments({paymentStatus: 'UNPAID'});
            let totalPages = Math.ceil(total / limit);
            const payment = await Payment.find({paymentStatus: 'UNPAID'}).skip(skip).limit(limit).populate('orderId', 'name email').populate('userId', 'name email');
            res.json({ message: 'Payment fetched successfully', status: 200, data: payment, success: true, error: false, total, totalPages});

             }
             catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllFaildPayment };


