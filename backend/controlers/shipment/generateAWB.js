const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");
const shiprocketService = require("../../services/shiprocket.service");

/**
 * Generate AWB for Shipment
 */
const generateAWB = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierId } = req.body;

    // Fetch shipment
    const shipment = await Shipment.findOne({ orderId });
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment not found or not created in Shiprocket",
        success: false,
        error: true,
      });
    }

    // Idempotency guard
    if (shipment.awb) {
      return res.status(400).json({
        message: "AWB already generated",
        success: false,
        error: true,
        data: {
          awb: shipment.awb,
          courierName: shipment.courierName,
        },
      });
    }

    if (!courierId) {
      return res.status(400).json({
        message: "courierId is required to generate AWB",
        success: false,
        error: true,
      });
    }

    // Generate AWB
    const awbResult = await shiprocketService.generateAWB(
      shipment.shiprocketShipmentId,
      courierId
    );

    const awbCode =
      awbResult?.data?.response?.data?.awb_code ||
      awbResult?.response?.data?.awb_code;

    if (!awbCode) {
      return res.status(500).json({
        message: "Failed to generate AWB",
        data: awbResult,
        success: false,
        error: true,
      });
    }

    // Persist shipment
    shipment.awb = awbCode;
    shipment.courierId = courierId;
    shipment.courierName = awbResult?.data?.response?.data?.courier_name;
    shipment.shipmentStatus = "AWB_GENERATED";

    await shipment.save();

    // Update order shipment status
    await Order.findByIdAndUpdate(orderId, {
      shipmentStatus: "AWB_GENERATED",
    });

    return res.json({
      message: "AWB generated successfully",
      success: true,
      error: false,
      data: {
        orderId,
        awb: shipment.awb,
        courierName: shipment.courierName,
      },
    });
  } catch (error) {
    console.error("Generate AWB Error:", error.message);

    res.status(500).json({
      message: "Failed to generate AWB",
      success: false,
      error: true,
    });
  }
};

module.exports = { generateAWB };
