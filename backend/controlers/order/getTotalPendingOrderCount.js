let orderModel = require("../../models/orderModel");

const getTotalPendingOrderCount = async (req, res) => {
  try {
    let totalOrderCount = await orderModel.countDocuments({ status: "PENDING" });
    res.status(200).json({
      message: "Total order count retrieved successfully",
      data: totalOrderCount,
      success: true,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { getTotalPendingOrderCount };
