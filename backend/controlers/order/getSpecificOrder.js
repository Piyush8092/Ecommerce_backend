const mongoose = require("mongoose");
const Order = require("../../models/orderModel");

const getSpecificOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid orderId",
        success: false,
        error: true,
      });
    }

    const query = { _id: orderId, userId: req.user._id };

    const orders = await Order.findOne(query)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      error: false,
      data: orders,
    });
  } catch (e) {
    console.error("getSpecificOrder error:", e);

    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = { getSpecificOrder };
