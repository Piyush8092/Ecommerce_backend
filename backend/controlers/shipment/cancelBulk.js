const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");

/**
 * Cancel Multiple Shipments
 */
const cancelBulk = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        message: "orderIds array is required",
        success: false,
        error: true,
      });
    }

    const shipments = await Shipment.find({
      orderId: { $in: orderIds },
      awb: { $exists: true },
    });

    if (!shipments.length) {
      return res.status(404).json({
        message: "No cancellable shipments found",
        success: false,
        error: true,
      });
    }

    const awbs = shipments.map((s) => s.awb);

    const cancelResult = await shiprocketService.cancelShipment(awbs);

    if (!cancelResult.success) {
      return res.status(500).json({
        message: "Failed to cancel shipments",
        data: cancelResult.error,
        success: false,
        error: true,
      });
    }

    await Shipment.updateMany(
      { awb: { $in: awbs } },
      { shipmentStatus: "CANCELLED" }
    );

    await Order.updateMany(
      { _id: { $in: orderIds } },
      { shipmentStatus: "CANCELLED" }
    );

    return res.json({
      message: "Shipments cancelled successfully",
      data: cancelResult.data,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Cancel Bulk Error:", error.message);
    res.status(500).json({
      message: "Failed to cancel shipments",
      success: false,
      error: true,
    });
  }
};

module.exports = { cancelBulk };
