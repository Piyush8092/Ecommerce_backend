let mongoose = require("mongoose");

let paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["CASH", "CARD", "UPI", "PREPAID"],
      default: "CASH",
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Payment = mongoose.model("Payment", paymentSchema);
