const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");

/**
 * Sync Shipment Status from Shiprocket
 */
const syncShipmentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shipment = await Shipment.findOne({ orderId });
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment or Shiprocket Shipment ID not found",
        success: false,
        error: true,
      });
    }

    const trackingResult = await shiprocketService.getTracking(
      shipment.shiprocketShipmentId
    );

    if (!trackingResult.success) {
      return res.status(500).json({
        message: "Failed to fetch shipment status",
        data: trackingResult.error,
        success: false,
        error: true,
      });
    }

    const trackingData = trackingResult.data?.tracking_data;

    if (trackingData?.shipment_status) {
      shipment.shipmentStatus = trackingData.shipment_status;
      shipment.lastSyncedAt = new Date();
      await shipment.save();

      await Order.findByIdAndUpdate(orderId, {
        shipmentStatus: trackingData.shipment_status,
      });
    }

    return res.json({
      message: "Shipment status synced successfully",
      data: trackingData,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Sync Shipment Status Error:", error.message);
    res.status(500).json({
      message: "Failed to sync shipment status",
      success: false,
      error: true,
    });
  }
};

module.exports = { syncShipmentStatus };
