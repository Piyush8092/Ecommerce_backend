const Order = require("../../models/orderModel");

const getOrderByShipmentStatus = async (req, res) => {
  try {
    const shipmentStatus = req.query.shipmentStatus.toUpperCase(); // convert shipment status to uppercase for consistency
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const role = req.user.role.toUpperCase(); // convert role to uppercase for consistency

    // roles that can see all orders by shipment status
    const elevatedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

    if (!elevatedRoles.includes(role)) {
      return res.status(401).json({
        message: "Unauthorized",
        status: 401,
        success: false,
        error: true,
      });
    }

    let filter = {
      shipmentStatus: shipmentStatus,
    }; // initialize filter object with shipment status

    // EMPLOYEE should NOT see pending orders
    if (role === "EMPLOYEE") {
      filter.status = { $ne: "PENDING" };
    }

    // count for pagination
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // fetch orders
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
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

module.exports = { getOrderByShipmentStatus };
