let Payment = require('../../models/paymentModel');

const createPayment = async (req, res) => {
    try {
        let userId = req.user._id;
        let payload = req.body;
        if (!payload.orderId || !payload.amount || !payload.paymentMethod || !payload.paymentId ||!payload.paymentStatus) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        payload.userId = userId;
        // Create new payment
        const newPayment = new Payment(payload);

          const savedPayment = await newPayment.save();
          
        res.json({ message: 'Payment created successfully', status: 200, data: savedPayment, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createPayment };

