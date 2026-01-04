const shiprocketService = require("../../services/shiprocket.service");

/**
 * Track Multiple Shipments
 * Retrieves tracking information for multiple shipments by AWB numbers
 */
const trackMultipleShipments = async (req, res) => {
  try {
    const { awbNumbers } = req.body;

    // Validation checks
    if (!Array.isArray(awbNumbers) || awbNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "AWB numbers array is required",
      });
    }

    if (awbNumbers.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum 50 AWB numbers allowed per request",
      });
    }

    // Call Shiprocket service
    const result = await shiprocketService.trackMultipleShipments(awbNumbers);

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message: "Failed to fetch shipment tracking",
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Track Multiple Shipments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { trackMultipleShipments };
