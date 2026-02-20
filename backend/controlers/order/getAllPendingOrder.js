const Order = require("../../models/orderModel");

const getAllPendingOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const role = req.user.role.toUpperCase(); // convert role to uppercase for consistency
    const userId = req.user._id;

    // build filter condition
    let filter = { status: "PENDING" };

    // ROLE-BASED VISIBILITY
    if (role === "EMPLOYEE") {
      // employee sees only assigned orders
      filter.assignedEmployeeId = userId;
    } else if (!["ADMIN", "MANAGER"].includes(role)) {
      // normal user sees only his orders
      filter.userId = userId;
    }
    // ADMIN & MANAGER see all orders

    // count for pagination
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // fetch orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
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

module.exports = { getAllPendingOrder };
