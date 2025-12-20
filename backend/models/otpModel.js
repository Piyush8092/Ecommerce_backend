const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be 10 digits",
      },
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL index
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Helpful lookup index
otpSchema.index({ phone: 1, createdAt: -1 });

module.exports = mongoose.model("Otp", otpSchema);
