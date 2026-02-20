const mongoose = require("mongoose");
const Order = require("../../models/orderModel");

const getOrderByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid productId",
        success: false,
        error: true,
      });
    }

    let query = { "items.productId": productId };

    if (req.user.role === "EMPLOYEE") {
      query.status = { $ne: "PENDING" }; // Exclude pending orders for employees
      query.assignedEmployeeId = req.user._id;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate({
        path: "items.productId",
        select: "name isComboProduct",
      })
      .populate("assignedEmployeeId", "name email phone image"); // populate assigned employee details

    const total = await Order.countDocuments(query);

    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      error: false,
      data: orders,
      total,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (e) {
    console.error("getOrderByProductId error:", e);

    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = { getOrderByProductId };
