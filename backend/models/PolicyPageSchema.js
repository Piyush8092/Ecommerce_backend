const mongoose = require("mongoose");

const policyPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    slug: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
      lowercase: true,
    },
    contentHTML: { type: String }, // Storing Tiptap HTML output
    contentJSON: { type: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PolicyPage", policyPageSchema);
