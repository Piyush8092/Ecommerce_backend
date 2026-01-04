const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");

/**
 * Get Shipment by Order ID
 * Retrieves shipment details for a specific order
 */
const getShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Find shipment
    const shipment = await Shipment.findOne({ orderId }).populate("orderId");

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found for this order",
        status: 404,
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Shipment fetched successfully",
      status: 200,
      data: shipment,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Shipment Error:", error);
    res.status(500).json({
      message: "Failed to fetch shipment",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getShipment };

