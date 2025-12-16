const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");

/**
 * Shiprocket Webhook Handler
 * Handles webhook updates from Shiprocket for shipment status changes
 */
const shiprocketWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    // Log webhook data for debugging
    console.log("Shiprocket Webhook Received:", JSON.stringify(webhookData, null, 2));

    // Extract relevant data from webhook
    const {
      awb,
      order_id,
      shipment_id,
      current_status,
      courier_name,
      pickup_scheduled_date,
      delivered_date,
      tracking_data,
    } = webhookData;

    // Find shipment by AWB or shipment ID
    let shipment;
    if (awb) {
      shipment = await Shipment.findOne({ awb });
    } else if (shipment_id) {
      shipment = await Shipment.findOne({ shiprocketShipmentId: shipment_id });
    }

    if (!shipment) {
      console.log("Shipment not found for webhook data");
      // Return 200 to acknowledge webhook even if shipment not found
      return res.status(200).json({
        message: "Webhook received but shipment not found",
        success: true,
      });
    }

    // Map Shiprocket status to our shipment status
    const statusMapping = {
      "Pickup Scheduled": "PICKUP_SCHEDULED",
      "Picked Up": "PICKED_UP",
      "In Transit": "IN_TRANSIT",
      "Out for Delivery": "OUT_FOR_DELIVERY",
      "Delivered": "DELIVERED",
      "Cancelled": "CANCELLED",
      "RTO Initiated": "RTO_INITIATED",
      "RTO Delivered": "RTO_DELIVERED",
      "Lost": "LOST",
      "Damaged": "DAMAGED",
    };

    const newStatus = statusMapping[current_status] || shipment.shipmentStatus;

    // Update shipment
    shipment.shipmentStatus = newStatus;
    
    if (courier_name) {
      shipment.courierName = courier_name;
    }
    
    if (pickup_scheduled_date) {
      shipment.pickupScheduledDate = new Date(pickup_scheduled_date);
    }
    
    if (delivered_date) {
      shipment.actualDeliveryDate = new Date(delivered_date);
    }

    // Add tracking history
    if (tracking_data && Array.isArray(tracking_data)) {
      shipment.trackingHistory = tracking_data.map((item) => ({
        status: item.status || current_status,
        statusCode: item.status_code,
        location: item.location,
        timestamp: new Date(item.date),
        activity: item.activity,
      }));
    } else if (current_status) {
      // Add single tracking entry
      shipment.trackingHistory.push({
        status: current_status,
        location: "",
        timestamp: new Date(),
        activity: current_status,
      });
    }

    await shipment.save();

    // Update order shipment status
    const order = await Order.findById(shipment.orderId);
    if (order) {
      order.shipmentStatus = newStatus;
      
      // Update order status based on shipment status
      if (newStatus === "DELIVERED") {
        order.status = "DELIVERED";
      } else if (newStatus === "PICKED_UP" || newStatus === "IN_TRANSIT") {
        order.status = "SHIPPED";
      }
      
      await order.save();
    }

    res.status(200).json({
      message: "Webhook processed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Shiprocket Webhook Error:", error);
    // Return 200 to acknowledge webhook even on error
    res.status(200).json({
      message: "Webhook received but processing failed",
      error: error.message,
      success: false,
    });
  }
};

module.exports = { shiprocketWebhook };

