let Payment = require('../../models/paymentModel');

const getSpecificPayment = async (req, res) => {
    try {
        let id = req.params.id;
        const payment = await Payment.findById(id).populate('orderId', 'name email').populate('userId', 'name email');
        res.json({ message: 'Payment fetched successfully', status: 200, data: payment, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getSpecificPayment };


