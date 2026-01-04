const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");

/**
 * Get Shipment Tracking
 * Retrieves real-time tracking information from Shiprocket
 */
const getShipmentTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Find shipment
    const shipment = await Shipment.findOne({ orderId });
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment not found or not yet created",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Get tracking from Shiprocket
    const trackingResult = await shiprocketService.getTracking(
      shipment.shiprocketShipmentId
    );

    if (!trackingResult.success) {
      return res.status(500).json({
        message: "Failed to fetch tracking information",
        status: 500,
        data: trackingResult.error,
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Tracking information fetched successfully",
      status: 200,
      data: {
        shipment: shipment,
        tracking: trackingResult.data,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Shipment Tracking Error:", error);
    res.status(500).json({
      message: "Failed to fetch tracking information",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getShipmentTracking };

