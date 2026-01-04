const shiprocketService = require("../../services/shiprocket.service");
const Shipment = require("../../models/shipmentModel");

/**
 * Generate Shipment Invoice
 * Generates or fetches invoice PDF for a shipment
 */
const generateShipmentInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find shipment in database
    const shipment = await Shipment.findOne({ orderId });
    if (!shipment || !shipment.shiprocketShipmentId) {
      return res.status(404).json({
        message: "Shipment not found or not created in Shiprocket",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Prevent invoice generation for cancelled shipments
    if (shipment.shipmentStatus === "CANCELLED") {
      return res.status(400).json({
        message: "Cannot generate invoice for cancelled shipment",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Idempotency. If invoice already exists, return it
    if (shipment.invoiceUrl) {
      return res.json({
        message: "Invoice already generated",
        status: 200,
        data: {
          invoiceUrl: shipment.invoiceUrl,
          shipment,
        },
        success: true,
        error: false,
      });
    }

    // Generate invoice from Shiprocket
    const invoiceResult = await shiprocketService.generateInvoice(
      shipment.shiprocketShipmentId
    );

    if (!invoiceResult.success) {
      return res.status(500).json({
        message: "Failed to generate invoice from Shiprocket",
        status: 500,
        data: invoiceResult.error,
        success: false,
        error: true,
      });
    }

    // Persist invoice URL
    if (invoiceResult.data?.invoice_url) {
      shipment.invoiceUrl = invoiceResult.data.invoice_url;
      await shipment.save();
    }

    return res.json({
      message: "Invoice generated successfully",
      status: 200,
      data: {
        invoiceUrl: shipment.invoiceUrl,
        shipment,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Generate Shipment Invoice Error:", {
      orderId: req.params.orderId,
      error: error.message,
    });

    return res.status(500).json({
      message: "Failed to generate shipment invoice",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { generateShipmentInvoice };
