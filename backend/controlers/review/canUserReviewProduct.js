const Order = require("../../models/orderModel");

const canUserReviewProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        canReview: false,
        message: "Product ID is required",
      });
    }

    const order = await Order.findOne({
      userId: userId,
      productId: productId,
      status: "DELIVERED",
    }).select("_id");

    if (!order) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "NOT_DELIVERED_OR_NOT_PURCHASED",
      });
    }

    return res.status(200).json({
      success: true,
      canReview: true,
      orderId: order._id,
      reason: "DELIVERED",
    });
  } catch (error) {
    console.error("canUserReviewProduct error:", error);
    return res.status(500).json({
      success: false,
      canReview: false,
      message: "Server error while checking review eligibility",
    });
  }
};

module.exports = {
  canUserReviewProduct,
};
