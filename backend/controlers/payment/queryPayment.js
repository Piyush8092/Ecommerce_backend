const Payment = require("../../models/paymentModel");

/**
 * Query Payments by amount or date
 */
const queryPayment = async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const searchConditions = [];

    // 1. Amount search (number only)
    if (!isNaN(query) && query !== "") {
      searchConditions.push({ amount: Number(query) });
    }

    // 2. Date search (YYYY-MM-DD)
    if (!isNaN(Date.parse(query))) {
      const start = new Date(query);
      start.setHours(0, 0, 0, 0);

      const end = new Date(query);
      end.setHours(23, 59, 59, 999);

      searchConditions.push({
        createdAt: { $gte: start, $lte: end },
      });
    }

    // Build final filter
    const filter = searchConditions.length ? { $or: searchConditions } : {};

    const payments = await Payment.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name email phone image")
      .populate({
        path: "orderId",
        populate: {
          path: "productId",
          select: "name image",
        },
      })
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
      total,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("queryPayment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search payments",
    });
  }
};

module.exports = { queryPayment };
