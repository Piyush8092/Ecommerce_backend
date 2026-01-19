const Shipment = require("../../models/shipmentModel");
const Order = require("../../models/orderModel");
const { verifyShiprocketSignature } = require("../../utils/shiprocket");

const shiprocketWebhook = async (req, res) => {
  try {
    const payload = req.body;

    // Signature verification. Log only, never block Shiprocket
    if (!verifyShiprocketSignature(req)) {
      console.warn("Invalid Shiprocket signature");
      return res.status(200).send("OK");
    }

    console.log("Shiprocket Webhook:", payload);

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

    const order = await Order.findById(shipment.orderId);
    if (!order) {
      return res.status(200).json({ success: true });
    }

    /* ----------------------------------
       STATUS HANDLING
    ---------------------------------- */

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

    if (
      STATUS_PRIORITY[incomingStatus] >=
      STATUS_PRIORITY[shipment.shipmentStatus]
    ) {
      shipment.shipmentStatus = incomingStatus;
    }

    /* ----------------------------------
       BASIC SHIPMENT FIELDS
    ---------------------------------- */

    if (courier_name) shipment.courierName = courier_name;
    if (pickup_scheduled_date)
      shipment.pickupScheduledDate = new Date(pickup_scheduled_date);
    if (delivered_date) shipment.actualDeliveryDate = new Date(delivered_date);

    /* ----------------------------------
       TRACKING HISTORY (SHIPMENT ONLY)
    ---------------------------------- */

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

    /* ----------------------------------
       ORDER STATUS UPDATE
    ---------------------------------- */

    if (order.status !== "CANCELLED") {
      order.shipmentStatus = shipment.shipmentStatus;

      if (shipment.shipmentStatus === "DELIVERED") {
        order.status = "DELIVERED";
        order.deliveredAt = new Date(delivered_date || Date.now());

        // COD collected at delivery
        if (
          (order.paymentType === "COD" ||
            order.paymentType === "PARTIAL_COD") &&
          !order.codCollectedAt
        ) {
          order.codCollectedAt = new Date(delivered_date || Date.now());
          order.codStatus = "COLLECTED";

          shipment.codCollectedAt = order.codCollectedAt;
        }
      }
    }

    /* ----------------------------------
       COD REMITTANCE
       (ONLY WHEN SHIPROCKET SENDS IT)
    ---------------------------------- */

    if (
      current_status &&
      current_status.toLowerCase().includes("remitted") &&
      (order.paymentType === "COD" || order.paymentType === "PARTIAL_COD")
    ) {
      if (!order.codRemittedAt) {
        order.codRemittedAt = new Date();
        order.codStatus = "REMITTED";
      }

      if (!shipment.codRemittedAt) {
        shipment.codRemittedAt = order.codRemittedAt;
      }
    }

    /* ----------------------------------
       SAVE
    ---------------------------------- */

    await shipment.save();
    await order.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Shiprocket Webhook Error:", error.message);

    // ALWAYS return 200
    return res.status(200).json({ success: false });
  }
};

module.exports = { shiprocketWebhook };
