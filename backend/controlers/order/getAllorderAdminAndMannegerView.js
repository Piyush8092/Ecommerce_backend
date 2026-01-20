let Order = require("../../models/orderModel");

const getAllorderAdminAndMannegerView = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.user.role.toUpperCase(); // convert role to uppercase for consistency

    let query = {};

    // EMPLOYEE should NOT see pending orders
    if (role === "EMPLOYEE") {
      query.status = { $ne: "PENDING" };
      query.assignedEmployeeId = req.user._id;
    }

    let total = await Order.countDocuments(query);
    let totalPages = Math.ceil(total / limit);

    const order = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("assignedEmployeeId", "name email phone image"); // populate assigned employee details
    res.json({
      message: "Order fetched successfully",
      status: 200,
      data: order,
      success: true,
      error: false,
      total,
      totalPages,
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

module.exports = { getAllorderAdminAndMannegerView };
