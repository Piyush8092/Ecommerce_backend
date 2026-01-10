const mongoose = require("mongoose");

/**
 * Shipment Model
 * Tracks shipment details from Shiprocket for each order
 */
const shipmentSchema = new mongoose.Schema(
  {
    // Reference to Order
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // One shipment per order
    },

    // Shiprocket IDs
    shiprocketOrderId: {
      type: String,
      default: null,
    },
    shiprocketShipmentId: {
      type: String,
      default: null,
    },

    // AWB (Air Waybill) Number
    awb: {
      type: String,
      default: null,
    },

    // Courier Information
    courierName: {
      type: String,
      default: null,
    },
    courierId: {
      type: Number,
      default: null,
    },

    // Tracking URLs
    labelUrl: {
      type: String,
      default: null,
    },
    manifestUrl: {
      type: String,
      default: null,
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
    trackingUrl: {
      type: String,
      default: null,
    },

    // Shipment Status
    shipmentStatus: {
      type: String,
      enum: [
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
      default: "PENDING",
    },
    //COD Details
    isCod: {
      type: Boolean,
      default: false,
    },
    codAmount: {
      type: Number,
      default: 0,
    },
    codCollectedAt: {
      type: Date,
      default: null,
    },
    codRemittedAt: {
      type: Date,
      default: null,
    },
    // Pickup Details
    pickupRetryCount: { type: Number, default: 0 },
    pickupFailureReason: { type: String, default: null },
    lastPickupActionAt: Date,
    pickupScheduledDate: {
      type: Date,
      default: null,
    },
    pickupTokenNumber: {
      type: String,
      default: null,
    },
    pickupLocation: {
      type: String,
      default: "Primary", // Default pickup location
    },

    // Delivery Details
    expectedDeliveryDate: {
      type: Date,
      default: null,
    },
    actualDeliveryDate: {
      type: Date,
      default: null,
    },

    // Tracking History
    trackingHistory: [
      {
        status: String,
        statusCode: String,
        location: String,
        timestamp: Date,
        activity: String,
      },
    ],

    // Dimensions and Weight
    dimensions: {
      length: { type: Number, default: 10 }, // cm
      breadth: { type: Number, default: 10 }, // cm
      height: { type: Number, default: 10 }, // cm
      weight: { type: Number, default: 0.5 }, // kg
    },

    // Additional Information
    remarks: {
      type: String,
      default: null,
    },

    // Error tracking
    lastError: {
      type: String,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    manifestGeneratedAt: { type: Date, default: null },
    lastSyncedAt: { type: Date, default: null },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
shipmentSchema.index({ shiprocketOrderId: 1 });
shipmentSchema.index({ awb: 1 });
shipmentSchema.index({ shipmentStatus: 1 });

// Virtual for checking if shipment is active
shipmentSchema.virtual("isActive").get(function () {
  return !["DELIVERED", "CANCELLED", "RTO_DELIVERED", "LOST"].includes(
    this.shipmentStatus
  );
});

module.exports = mongoose.model("Shipment", shipmentSchema);
