const mongoose = require("mongoose");
const { Schema } = mongoose;

// Purpose: Store one strict review per product per user

const ProductReviewSchema = new Schema(
  {
    // Relations
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Review content
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      trim: true,
    },

    // Media (S3 keys only)
    media: {
      images: {
        type: [String], // array of S3 keys
        default: [],
      },
      video: {
        type: String, // single S3 key
      },
    },

    // Visibility & moderation
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// VALIDATION: At least one of rating | message | media
// --------------------------------------------------
ProductReviewSchema.pre("validate", function (next) {
  const hasRating = typeof this.rating === "number";
  const hasMessage = !!this.message;
  const hasImages = this.media?.images?.length > 0;
  const hasVideo = !!this.media?.video;

  if (!hasRating && !hasMessage && !hasImages && !hasVideo) {
    return next(
      new Error(
        "Review must contain at least one of rating, message, image, or video"
      )
    );
  }

  next();
});

// --------------------------------------------------
// INDEXES
// --------------------------------------------------

// Strict: one review per product per user
ProductReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Product page fetch
ProductReviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

// Home page testimonials
ProductReviewSchema.index({ isFeatured: 1, status: 1, updatedAt: -1 });

// User profile / edit
ProductReviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
