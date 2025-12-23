let CouponCode = require("../../models/couponCodeModel");
let User = require("../../models/userModel");

const createCoupon = async (req, res) => {
  try {
    let payload = req.body;

    // Validate required fields
    if (!payload.code || !payload.discount || !payload.expiryDate) {
      return res.status(400).json({
        message: "Code, discount, and expiryDate are required",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Check if user is ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({
        message: "Unauthorized - Only ADMIN can create coupons",
        status: 401,
        success: false,
        error: true,
      });
    }

    // Check if assignToAllUsers flag is true
    if (payload.assignToAllUsers === true) {
      // Fetch all users from database
      const allUsers = await User.find({}, "_id");

      if (allUsers.length === 0) {
        return res.status(400).json({
          message: "No users found in the system",
          status: 400,
          success: false,
          error: true,
        });
      }

      // Create coupons for each user
      const couponsCreated = [];

      for (let user of allUsers) {
        const newCoupon = new CouponCode({
          code: payload.code,
          discount: payload.discount,
          expiryDate: payload.expiryDate,
          userId: user._id,
        });

        const savedCoupon = await newCoupon.save();
        couponsCreated.push(savedCoupon);
      }

      return res.json({
        message: `Coupon assigned to ${couponsCreated.length} users successfully`,
        status: 200,
        data: {
          totalUsersAssigned: couponsCreated.length,
          coupons: couponsCreated,
        },
        success: true,
        error: false,
      });
    } else {
      // Create single coupon without user assignment
      const newCoupon = new CouponCode(payload);
      const savedCoupon = await newCoupon.save();

      return res.json({
        message: "Coupon created successfully",
        status: 200,
        data: savedCoupon,
        success: true,
        error: false,
      });
    }
  } catch (e) {
    console.error("Coupon creation error:", e);
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createCoupon };
