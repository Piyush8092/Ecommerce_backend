let CouponCode = require("../../models/couponCodeModel");

const UsedCoupon = async (req, res) => {
  try {
    let userId = req.user._id;
    let { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const coupon = await CouponCode.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    let AlreadyUsedCoupon = await CouponCode.findOne({ code, userId });
    if (AlreadyUsedCoupon) {
      return res.status(400).json({ message: "Coupon already used" });
    }
    if (coupon.userId) {
      return res.status(400).json({ message: "Coupon already used" });
    }
    if (coupon.expiryDate < Date.now()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    coupon.userId = userId;
    await coupon.save();
    res.json({
      message: "Coupon used successfully",
      status: 200,
      data: coupon,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { UsedCoupon };
