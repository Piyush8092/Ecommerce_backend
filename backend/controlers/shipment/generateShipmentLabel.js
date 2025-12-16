const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");

/**
 * Generate Shipment Label
 * Generates shipping label for a shipment (ADMIN/MANAGER only)
 */
const generateShipmentLabel = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if user is ADMIN or MANAGER
    if (req.user.role !== "ADMIN" && req.user.role !== "MANAGER") {
      return res.status(403).json({
        message: "Unauthorized. Only ADMIN or MANAGER can generate labels",
        status: 403,
        success: false,
        error: true,
      });
    }

    // Find shipment
    const shipment = await Shipment.findOne({ orderId });
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment not found",
        status: 404,
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

