const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");
const Shipment = require("../../models/shipmentModel");

/**
 * Request Pickup
 * Schedules pickup for a shipment in Shiprocket
 */
const requestPickup = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch shipment
    const shipment = await Shipment.findOne({ orderId });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found for this order",
        success: false,
        error: true,
      });
    }

    // Validation checks
    if (!shipment.awb) {
      return res.status(400).json({
        message: "AWB not generated. Cannot request pickup",
        success: false,
        error: true,
      });
    }

    const invalidStatuses = [
      "CANCELLED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
    ];

    if (invalidStatuses.includes(shipment.shipmentStatus)) {
      return res.status(400).json({
        message: `Pickup cannot be requested. Current status: ${shipment.shipmentStatus}`,
        success: false,
        error: true,
      });
    }

    // Call Shiprocket pickup API
    const pickupResult = await shiprocketService.requestPickup(
      shipment.shiprocketShipmentId
    );

    if (!pickupResult.success) {
      return res.status(500).json({
        message: "Failed to request pickup from Shiprocket",
        data: pickupResult.error,
        success: false,
        error: true,
      });
    }

    // Update shipment status
    shipment.shipmentStatus = "PICKUP_SCHEDULED";
    shipment.pickupScheduledDate = new Date();
    await shipment.save();

    // Update order shipment status
    await Order.findByIdAndUpdate(orderId, {
      shipmentStatus: "PICKUP_SCHEDULED",
    });

    return res.json({
      message: "Pickup requested successfully",
      data: shipment,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error(
      "Request Pickup Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to request pickup",
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { requestPickup };
