const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");

/**
 * Generate Batch Manifest
 * Generates one batch manifest for multiple shipments
 */
const generateBatchManifest = async (req, res) => {
  try {
    const { orderIds } = req.body;

    // Validate input
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        message: "orderIds must be a non-empty array",
        success: false,
        error: true,
      });
    }

    // Fetch shipments
    const shipments = await Shipment.find({
      orderId: { $in: orderIds },
    });

    if (shipments.length !== orderIds.length) {
      return res.status(404).json({
        message: "One or more shipments not found",
        success: false,
        error: true,
      });
    }

    // Validate shipments
    const allowedStatuses = ["PICKUP_REQUESTED", "PICKED_UP"];

    const awbs = [];
    const courierIds = new Set();
    const pickupLocations = new Set();

    for (const shipment of shipments) {
      if (!shipment.awb) {
        return res.status(400).json({
          message: `AWB missing for order ${shipment.orderId}`,
          success: false,
          error: true,
        });
      }

      if (!allowedStatuses.includes(shipment.shipmentStatus)) {
        return res.status(400).json({
          message: `Invalid status for order ${shipment.orderId}: ${shipment.shipmentStatus}`,
          success: false,
          error: true,
        });
      }

      awbs.push(shipment.awb);
      courierIds.add(shipment.courierId?.toString());
      pickupLocations.add(shipment.pickupLocation);
    }

    // Ensure compatibility
    if (courierIds.size > 1) {
      return res.status(400).json({
        message: "All shipments must use the same courier",
        success: false,
        error: true,
      });
    }

    if (pickupLocations.size > 1) {
      return res.status(400).json({
        message: "All shipments must have the same pickup location",
        success: false,
        error: true,
      });
    }

    // If manifest already exists, reuse it
    const existingManifestUrl = shipments.find(
      (s) => s.manifestUrl
    )?.manifestUrl;
    if (existingManifestUrl) {
      return res.json({
        message: "Manifest already generated",
        data: { manifestUrl: existingManifestUrl },
        success: true,
        error: false,
      });
    }

    // Call Shiprocket
    const manifestResult = await shiprocketService.generateBatchManifest(awbs);

    if (!manifestResult.success) {
      return res.status(500).json({
        message: "Failed to generate manifest from Shiprocket",
        data: manifestResult.error,
        success: false,
        error: true,
      });
    }

    const manifestUrl =
      manifestResult.data?.manifest_url ||
      manifestResult.data?.data?.manifest_url;

    if (!manifestUrl) {
      return res.status(500).json({
        message: "Manifest URL not returned by Shiprocket",
        success: false,
        error: true,
      });
    }

    // Update all shipments
    await Shipment.updateMany(
      { orderId: { $in: orderIds } },
      {
        $set: {
          manifestUrl,
          manifestGeneratedAt: new Date(),
        },
      }
    );

    return res.json({
      message: "Manifest generated successfully",
      data: {
        manifestUrl,
        totalShipments: shipments.length,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error(
      "Batch Manifest Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to generate batch manifest",
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { generateBatchManifest };
