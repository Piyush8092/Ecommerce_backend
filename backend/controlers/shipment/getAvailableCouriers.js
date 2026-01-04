const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");

/**
 * Get Available Couriers
 * Fetches available courier services for an order
 */
const getAvailableCouriers = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupPostcode } = req.query;

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
      pickupPostcode: pickupPostcode || "122001", // Default pickup postcode
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

