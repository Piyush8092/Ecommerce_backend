const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");

/**
 * Get Available Couriers
 * Fetches available courier services for an order (ADMIN/MANAGER only)
 */
const getAvailableCouriers = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupPostcode } = req.query;

    // Check if user is ADMIN or MANAGER
    if (req.user.role !== "ADMIN" && req.user.role !== "MANAGER") {
      return res.status(403).json({
        message: "Unauthorized. Only ADMIN or MANAGER can view couriers",
        status: 403,
        success: false,
        error: true,
      });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("deliveryAddressId");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Get available couriers
    const couriersResult = await shiprocketService.getAvailableCouriers({
      pickupPostcode: pickupPostcode || "110001", // Default pickup postcode
      deliveryPostcode: order.deliveryAddressId.zip,
      weight: 0.5, // Default weight in kg
      cod: order.paymentMethod === "COD" ? 1 : 0,
    });

    if (!couriersResult.success) {
      return res.status(500).json({
        message: "Failed to fetch available couriers",
        status: 500,
        data: couriersResult.error,
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Available couriers fetched successfully",
      status: 200,
      data: couriersResult.data,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Available Couriers Error:", error);
    res.status(500).json({
      message: "Failed to fetch available couriers",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAvailableCouriers };

