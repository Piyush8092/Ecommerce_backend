const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");
const shipmentConfig = require("../../config/shiprocket.config");
const { getOrderItemsDimensions } = require("../../utils/shiprocket");

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

    const { length, breadth, height, weight } = getOrderItemsDimensions(
      order.items
    );

    console.log("dimesion", length, breadth, height, weight);

    // Get available couriers
    const couriersResult = await shiprocketService.getAvailableCouriers({
      pickupPostcode: pickupPostcode || shipmentConfig.defaultPickupPincode, // Default pickup postcode
      deliveryPostcode: order.deliveryAddressId.zip,
      weight,
      length,
      breadth,
      height,
      cod: order.paymentType === "COD" ? 1 : 0,
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
