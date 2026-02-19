let mongoose = require("mongoose");

const PromotionalHighlightSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PromotionalHighlight",
  PromotionalHighlightSchema
);
