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
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RTO_INITIATED",
        "RTO_DELIVERED",
        "LOST",
        "DAMAGED"
      ],
      default: "PENDING",
    },

    // Pickup Details
    pickupScheduledDate: {
      type: Date,
      default: null,
    },
    pickupTokenNumber: {
      type: String,
      default: null,
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
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
shipmentSchema.index({ orderId: 1 });
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

