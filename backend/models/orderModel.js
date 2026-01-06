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
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "ACCEPTED", "RETURNED"],
      default: "PENDING",
    },
    cancelReason: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: null,
    },
    // Payment details
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
      enum: ["PAID", "FAILED", "UNPAID", "REFUND_INITIATED", "REFUNDED"], // Razorpay payment statuses
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
    razorpayRefundId: {
      type: String,
      default: null,
    },
    // Shipment tracking
    shipmentStatus: {
      type: String,
      enum: [
        "NOT_CREATED",
        "PENDING",
        "AWB_GENERATED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RTO",
        "LOST",
        "DAMAGED",
      ],
      default: "NOT_CREATED",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("Order", orderSchema);
