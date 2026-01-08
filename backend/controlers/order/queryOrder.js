const mongoose = require("mongoose");
const Order = require("../../models/orderModel");

const queryOrder = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;
    const role = req.user.role.toUpperCase();
    const userId = req.user._id;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // roles that can see all orders
    const elevatedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

    // build filter condition
    let filter = elevatedRoles.includes(role)
      ? {} // all orders for admin, manager, and employee
      : { userId }; // only user's orders for other roles

    if (query && query.trim() !== "") {
      const searchConditions = [];

      // 1. Order ID (ObjectId safe check)
      if (mongoose.Types.ObjectId.isValid(query)) {
        searchConditions.push({ _id: query });
      }

      // 2. Text based fields
      const regex = new RegExp(query, "i");

      searchConditions.push(
        { paymentStatus: regex },
        { shipmentStatus: regex },
        { status: regex }
      );

      // 3. Amount search (number)
      if (!isNaN(query)) {
        searchConditions.push({ totalAmount: Number(query) });
      }

      // 4. Date search (YYYY-MM-DD)
      if (!isNaN(Date.parse(query))) {
        const start = new Date(query);
        start.setHours(0, 0, 0, 0);

        const end = new Date(query);
        end.setHours(23, 59, 59, 999);

        searchConditions.push({
          createdAt: { $gte: start, $lte: end },
        });
      }

      // 5. Add search conditions to filter object
      filter.$or = searchConditions;
    }

    console.log("filter", filter);

    // fetch orders with pagination and populate related data fields
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId");

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      total,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("queryOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search orders",
    });
  }
};

module.exports = { queryOrder };
