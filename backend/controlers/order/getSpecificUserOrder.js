const Order = require("../../models/orderModel");

const getSpecificUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the URL parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total documents for pagination
    const total = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(total / limit);

    // Fetch orders with all related details
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("deliveryAddressId")
      .populate("userId", "name email phone")
      .populate({
        path: "items.productId",
        select: "name isComboProduct",
      })
      .populate("assignedEmployeeId", "name email phone image"); // populate assigned employee details

    res.status(200).json({
      message: "Orders fetched successfully",
      status: 200,
      data: orders,
      success: true,
      error: false,
      total,
      totalPages,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getSpecificUserOrder };
