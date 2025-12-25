const mongoose = require("mongoose");
const Order = require("../../models/orderModel");

const queryOrder = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

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

    // 5. Build final filter
    const filter = searchConditions.length ? { $or: searchConditions } : {};

    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("productId", "name price image")
      .sort({ createdAt: -1 });

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
