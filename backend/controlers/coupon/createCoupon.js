let     CouponCode = require('../../models/couponCodeModel');

const createCoupon = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload.code || !payload.discount || !payload.expiryDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Create new coupon
        const newCoupon = new CouponCode(payload);

          const savedCoupon = await newCoupon.save();
                                                     
        res.json({ message: 'Coupon created successfully', status: 200, data: savedCoupon, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createCoupon };


