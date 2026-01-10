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
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
          name: { type: String, required: true },
          image: { type: String, required: true },
          price: { type: Number, required: true },
          dimensions: {
            length: Number,
            breadth: Number,
            height: Number,
            weight: Number,
          },
          quantity: { type: Number, required: true, min: 1 },
          variant: {
            color: String,
            size: String,
          },
        },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "ACCEPTED",
        "RETURNED",
      ],
      default: "PENDING",
    },
    expectedDeliveryDate: {
      type: Date,
      default: null,
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
    paymentType: {
      type: String,
      enum: ["PREPAID", "COD", "PARTIAL_COD"],
      default: "PREPAID",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    prepaidAmount: {
      type: Number,
      default: 0, // Amount paid via Razorpay
    },

    codAmount: {
      type: Number,
      default: 0, // Amount to be collected by courier
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAILED", "UNPAID", "REFUND_INITIATED", "REFUNDED"], // Payment status
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
    // COD tracking
    codStatus: {
      type: String,
      enum: [
        "APPLICABLE",
        "PENDING",
        "IN_TRANSIT",
        "COLLECTED",
        "REMITTED",
        "FAILED",
      ],
      default: "APPLICABLE",
    },

    codCollectedAt: {
      type: Date,
      default: null,
    },

    codRemittedAt: {
      type: Date,
      default: null,
    },
    // Shipment tracking
    shipmentStatus: {
      type: String,
      enum: [
        "NOT_CREATED",
        "PENDING",
        "AWB_GENERATED",
        "PICKUP_NOT_SCHEDULED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "PICKED_UP_FAILED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RTO_INITIATED",
        "RTO_DELIVERED",
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

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ "items.productId": 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ codStatus: 1 });
orderSchema.index({ shipmentStatus: 1 });

module.exports = Order = mongoose.model("Order", orderSchema);
