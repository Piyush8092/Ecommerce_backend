let Payment = require('../../models/paymentModel');

const updatePayment = async (req, res) => {
    try {
        let id = req.params.id;
        let payload = req.body;
        
        // Find the payment
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found', status: 404, success: false, error: true });
        }

        // Check authorization - only ADMIN or the user who made the payment can update
        if (req.user.role !== 'ADMIN' && req.user._id.toString() !== payment.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized', status: 401, success: false, error: true });
        }

        // Update payment
        const updatedPayment = await Payment.findByIdAndUpdate(id, payload, { new: true }).populate('orderId', 'name email').populate('userId', 'name email');
        
        res.json({ message: 'Payment updated successfully', status: 200, data: updatedPayment, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updatePayment };

