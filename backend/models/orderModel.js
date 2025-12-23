let mongoose = require("mongoose");

let orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAddress",
      required: true,
    },
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "ACCEPTED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["PREPAID", "CARD", "UPI"], // Razorpay payment methods only
      default: "PREPAID",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAILED", "UNPAID"], // Razorpay payment statuses
      default: "UNPAID",
    },
    // Razorpay payment details
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    // Shipment tracking
    shipmentStatus: {
      type: String,
      enum: [
        "NOT_CREATED",
        "PENDING",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RTO",
        "LOST",
      ],
      default: "NOT_CREATED",
    },
    // Shiprocket Integration Fields
    trackingNumber: {
      type: String,
      default: null,
    },
    shiprocketOrderId: {
      type: String,
      default: null,
    },
    shiprocketShipmentId: {
      type: String,
      default: null,
    },
    estimatedDelivery: {
      type: Date,
      default: null,
    },
    shippingDetails: {
      courierName: String,
      courierId: String,
      awb: String,
      currentStatus: String,
      trackingUrl: String,
      shipmentHistory: [{
        status: String,
        location: String,
        timestamp: Date,
        activity: String,
      }],
    },
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("Order", orderSchema);
