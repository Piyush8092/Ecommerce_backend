const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");

/**
 * Request Pickup for Multiple Shipments
 */
const requestPickupBulk = async (req, res) => {
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
      shiprocketShipmentId: { $exists: true },
    });

    if (!shipments.length) {
      return res.status(404).json({
        message: "No valid shipments found for pickup",
        success: false,
        error: true,
      });
    }

    const shipmentIds = shipments.map((s) => s.shiprocketShipmentId);

    const pickupResult = await shiprocketService.requestPickupBulk(shipmentIds);

    if (!pickupResult.success) {
      return res.status(500).json({
        message: "Failed to request pickup",
        data: pickupResult.error,
        success: false,
        error: true,
      });
    }

    await Shipment.updateMany(
      { shiprocketShipmentId: { $in: shipmentIds } },
      { shipmentStatus: "PICKUP_SCHEDULED" }
    );

    return res.json({
      message: "Pickup scheduled successfully",
      data: pickupResult.data,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Request Pickup Bulk Error:", error.message);
    res.status(500).json({
      message: "Failed to request pickup",
      success: false,
      error: true,
    });
  }
};

module.exports = { requestPickupBulk };
