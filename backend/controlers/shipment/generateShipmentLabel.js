const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");

/**
 * Generate Shipment Label
 * Generates shipping label for a shipment
 */
const generateShipmentLabel = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    // Find shipment by ID
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    if (shipment.shipmentStatus === "CANCELLED") {
      return res.status(400).json({
        message: "Cannot generate label for cancelled shipment",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Generate label
    const labelResult = await shiprocketService.generateLabel(
      shipment.shiprocketShipmentId
    );

    if (!labelResult.success) {
      return res.status(500).json({
        message: "Failed to generate label",
        status: 500,
        data: labelResult.error,
        success: false,
        error: true,
      });
    }

    // Update shipment with label URL
    if (labelResult.data.label_url) {
      shipment.labelUrl = labelResult.data.label_url;
      await shipment.save();
    }

    res.json({
      message: "Label generated successfully",
      status: 200,
      data: {
        labelUrl: labelResult.data.label_url,
        shipment: shipment,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Generate Shipment Label Error:", error);
    res.status(500).json({
      message: "Failed to generate label",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { generateShipmentLabel };
