const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
  {
    content: {
      type: String, // Storing Tiptap HTML output
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrivacyPolicy", privacyPolicySchema);
