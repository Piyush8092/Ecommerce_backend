let CouponCode = require("../../models/couponCodeModel");

const getCouponByCode = async (req, res) => {
  try {
    let { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const coupon = await CouponCode.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }
    if (coupon.expiryDate < Date.now()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    let AlreadyUsedCoupon = await CouponCode.findOne({
      code,
      userId: req.user._id,
    });
    if (AlreadyUsedCoupon) {
      return res
        .status(400)
        .json({
          message: "Coupon already used",
          data: { discount: 0 },
          used: true,
        });
    }

    res.json({
      message: "Coupon fetched successfully",
      status: 200,
      data: coupon,
      success: true,
      error: false,
      used: false,
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

module.exports = { getCouponByCode };
