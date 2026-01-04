const Shipment = require("../../models/shipmentModel");

/**
 * Get All Shipments
 * Paginated shipment list with filters
 */
const getAllShipments = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    // Filters
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.orderId) {
      filter.orderId = req.query.orderId;
    }

    if (req.query.courierName) {
      filter.courierName = req.query.courierName;
    }

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const [shipments, total] = await Promise.all([
      Shipment.find(filter)
        .populate("orderId", "orderNumber totalAmount userId")
        .populate("userId", "name email phone")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),

      Shipment.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      error: false,
      message: "Shipments fetched successfully",
      data: shipments,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get shipments error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch shipments",
    });
  }
};

module.exports = { getAllShipments };
