const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");
const Shipment = require("../../models/shipmentModel");

/**
 * Cancel Shipment
 * Automatically chooses correct Shiprocket cancel API based on shipment state
 */
const cancelShipment = async (req, res) => {
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

    // Block cancellation after pickup and after delivery
    const nonCancellableStatuses = [
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "RTO_DELIVERED",
    ];

    if (nonCancellableStatuses.includes(shipment.shipmentStatus)) {
      return res.status(400).json({
        message: `Shipment cannot be cancelled after pickup. Current status: ${shipment.shipmentStatus}`,
        success: false,
        error: true,
      });
    }

    let cancelResult;

    // Decide cancel strategy
    if (shipment.awb) {
      // Cancel using AWB
      cancelResult = await shiprocketService.cancelShipment(shipment.awb);
    } else if (shipment.shiprocketOrderId) {
      // Cancel using order ID
      cancelResult = await shiprocketService.cancelOrder(
        shipment.shiprocketOrderId
      );
    } else {
      return res.status(500).json({
        message: "Invalid shipment state. Missing AWB and Shiprocket Order ID",
        success: false,
        error: true,
      });
    }

    // Handle Shiprocket failure
    if (!cancelResult.success) {
      return res.status(500).json({
        message: "Failed to cancel shipment in Shiprocket",
        data: cancelResult.error,
        success: false,
        error: true,
      });
    }

    // Update shipment record
    shipment.shipmentStatus = "CANCELLED";
    shipment.cancelledAt = new Date();
    await shipment.save();

    // Update order shipment status
    await Order.findByIdAndUpdate(orderId, {
      shipmentStatus: "CANCELLED",
    });

    return res.json({
      message: "Shipment cancelled successfully",
      data: shipment,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error(
      "Cancel Shipment Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to cancel shipment",
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { cancelShipment };
