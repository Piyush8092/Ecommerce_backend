const Order = require("../../models/orderModel");

const getAllShiftedOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const role = req.user.role.toUpperCase();
    const userId = req.user._id;

    // roles that can see all shipped orders
    const elevatedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

    // build filter condition
    const filter = elevatedRoles.includes(role)
      ? { status: "SHIPPED" }
      : { status: "SHIPPED", userId };

    // count for pagination
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // fetch orders
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("productId", "name price image length breadth height weight")
      .sort({ createdAt: -1 });

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

module.exports = { getAllShiftedOrder };
