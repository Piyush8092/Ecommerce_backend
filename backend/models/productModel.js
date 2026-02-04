let mongoose = require("mongoose");

let productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    discount: {
      type: Number,
      required: false,
    },
    stock: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 1,
    },
    avgRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    Availability: {
      type: String,
      enum: ["AVAILABLE", "OUT_OF_STOCK"],
      default: "AVAILABLE",
    },
    userCaseFAQ: [
      {
        question: {
          type: String,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
      },
    ],
    productInfoSections: [
      {
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["LIST", "STEPS", "TEXT"],
          required: true,
        },
        content: [
          {
            heading: String,
            text: String,
          },
        ],
      },
    ],
    colors: [String],
    sizes: [String],
    length: { type: Number, default: 10 }, // cm
    breadth: { type: Number, default: 10 }, // cm
    height: { type: Number, default: 10 }, // cm
    weight: { type: Number, default: 0.1 }, // kg
    allowCustomColor: { type: Boolean, default: false },
    allowCustomSize: { type: Boolean, default: false },
    // admin will manage top selling product
    topSelling: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = Product = mongoose.model("Product", productSchema);
