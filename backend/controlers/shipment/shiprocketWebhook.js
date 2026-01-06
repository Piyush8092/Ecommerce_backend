const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");
const { verifyShiprocketSignature } = require("../../utils/shiprocket");

/**
 * Shiprocket Webhook Handler (Production-ready)
 */
const shiprocketWebhook = async (req, res) => {
  try {
    const payload = req.body;

    if (!verifyShiprocketSignature(req)) {
      // Log but DO NOT reject
      console.warn("Invalid Shiprocket signature");
      return res.status(200).send("OK");
    }

    console.log("Shiprocket Webhook:", JSON.stringify(payload));

    const {
      awb,
      shipment_id,
      current_status,
      courier_name,
      pickup_scheduled_date,
      delivered_date,
      tracking_data,
    } = payload;

    // Find shipment
    const shipment = awb
      ? await Shipment.findOne({ awb })
      : await Shipment.findOne({ shiprocketShipmentId: shipment_id });

    if (!shipment) {
      return res.status(200).json({ success: true });
    }

    // Status priority map (prevents downgrade)
    const STATUS_PRIORITY = {
      CREATED: 1,
      AWB_GENERATED: 2,
      PICKUP_SCHEDULED: 3,
      PICKED_UP: 4,
      IN_TRANSIT: 5,
      OUT_FOR_DELIVERY: 6,
      DELIVERED: 7,
      RTO_INITIATED: 8,
      RTO_DELIVERED: 9,
      CANCELLED: 10,
    };

    const STATUS_MAPPING = {
      Manifested: "AWB_GENERATED",
      "Pickup Scheduled": "PICKUP_SCHEDULED",
      "Picked Up": "PICKED_UP",
      "In Transit": "IN_TRANSIT",
      "Out for Delivery": "OUT_FOR_DELIVERY",
      Delivered: "DELIVERED",
      Cancelled: "CANCELLED",
      "RTO Initiated": "RTO_INITIATED",
      "RTO Delivered": "RTO_DELIVERED",
      Undelivered: "RTO_INITIATED",
      "Reached at Hub": "IN_TRANSIT",
    };

    const incomingStatus =
      STATUS_MAPPING[current_status] || shipment.shipmentStatus;

    // Prevent status downgrade
    if (
      STATUS_PRIORITY[incomingStatus] >=
      STATUS_PRIORITY[shipment.shipmentStatus]
    ) {
      shipment.shipmentStatus = incomingStatus;
    }

    if (courier_name) shipment.courierName = courier_name;
    if (pickup_scheduled_date)
      shipment.pickupScheduledDate = new Date(pickup_scheduled_date);
    if (delivered_date) shipment.actualDeliveryDate = new Date(delivered_date);

    // Append tracking history safely
    if (Array.isArray(tracking_data)) {
      tracking_data.forEach((event) => {
        const exists = shipment.trackingHistory.some(
          (h) =>
            h.status === event.status &&
            new Date(h.timestamp).getTime() === new Date(event.date).getTime()
        );

        if (!exists) {
          shipment.trackingHistory.push({
            status: event.status || current_status,
            location: event.location || "",
            activity: event.activity || "",
            statusCode: event.status_code,
            timestamp: new Date(event.date || Date.now()),
          });
        }
      });
    }

    shipment.lastSyncedAt = new Date();
    await shipment.save();

    // Update order shipment status safely
    const order = await Order.findById(shipment.orderId);
    if (order && order.status !== "CANCELLED") {
      order.shipmentStatus = shipment.shipmentStatus;

      if (shipment.shipmentStatus === "DELIVERED") {
        order.status = "DELIVERED";
      }

      await order.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Shiprocket Webhook Error:", error.message);

    // ALWAYS return 200 to Shiprocket
    return res.status(200).json({ success: false });
  }
};

module.exports = { shiprocketWebhook };
