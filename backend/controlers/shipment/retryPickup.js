const Shipment = require("../../models/shipmentModel");
const shiprocketService = require("../../services/shiprocket.service");

const retryPickup = async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  if (shipment.shipmentStatus === "DELIVERED" || shipment.shipmentStatus === "CANCELLED") {
    return res.status(400).json({ message: "Shipment cannot be modified" });
  }

  if (shipment.shipmentStatus === "PICKED_UP") {
    return res.status(400).json({ message: "Pickup already completed" });
  }

  if (!shipment.shiprocketShipmentId) {
    return res
      .status(400)
      .json({ message: "Shipment not synced with courier" });
  }

  try {
    await shiprocketService.requestPickup(shipment.shiprocketShipmentId);

    shipment.shipmentStatus = "PICKUP_SCHEDULED";
    shipment.pickupScheduledDate = new Date();
    shipment.pickupRetryCount += 1;
    shipment.pickupFailureReason = null;
    shipment.lastPickupActionAt = new Date();

    await shipment.save();

    res.json({
      success: true,
      message: "Pickup scheduled successfully",
      shipment,
    });
  } catch (error) {
    shipment.shipmentStatus = "PICKED_UP_FAILED";
    shipment.pickupFailureReason =
      error.response?.data?.message || "Pickup retry failed";

    await shipment.save();

    res.status(500).json({
      message: "Pickup retry failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { retryPickup };
