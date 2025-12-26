const ProductReview = require("../../models/productReview");
const Order = require("../../models/orderModel");

const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, orderId, rating, message, media } = req.body;

    // 1. Verify order belongs to user and is DELIVERED
    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: "DELIVERED",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Order not delivered or not authorized",
      });
    }

    // 2. Create review
    const review = await ProductReview.create({
      productId,
      userId,
      orderId,
      rating,
      message,
      media,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = createReview;
