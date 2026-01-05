const Shipment = require("../../models/shipmentModel");
const shiprocketService = require("../../services/shiprocket.service");

/** Cancel Pickup */
const cancelPickup = async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  if (
    shipment.shipmentStatus === "DELIVERED" ||
    shipment.shipmentStatus === "CANCELLED"
  ) {
    return res.status(400).json({ message: "Shipment cannot be modified" });
  }

  if (shipment.shipmentStatus !== "PICKUP_SCHEDULED") {
    return res.status(400).json({
      message: "Pickup is not scheduled or already processed",
    });
  }

  try {
    await shiprocketService.cancelPickup(shipment.awb);

    shipment.shipmentStatus = "PICKED_UP_FAILED"; // Updated status to reflect pickup failure
    shipment.pickupScheduledDate = null;
    shipment.lastPickupActionAt = new Date();

    await shipment.save();

    res.json({
      success: true,
      message: "Pickup cancelled successfully",
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel pickup",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { cancelPickup };
