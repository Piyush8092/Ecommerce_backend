const Order = require("../../models/orderModel");
const { verifyRazorpaySignature } = require("../../utils/razorpay");

const razorpayWebhook = async (req, res) => {
  try {
    // 1. Verify signature
    if (!verifyRazorpaySignature(req)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Razorpay signature",
      });
    }

    const { event, payload } = req.body;

    /**
     * PAYMENT CAPTURED
     */
    if (event === "payment.captured") {
      const payment = payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayPaymentId: payment.id },
        { paymentStatus: "PAID" }
      );
    }

    /**
     * PAYMENT FAILED
     */
    if (event === "payment.failed") {
      const payment = payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayPaymentId: payment.id },
        { paymentStatus: "FAILED" }
      );
    }

    /**
     * REFUND INITIATED
     */
    if (event === "refund.created") {
      const refund = payload.refund.entity;

      await Order.findOneAndUpdate(
        { razorpayPaymentId: refund.payment_id },
        { paymentStatus: "REFUND_INITIATED" }
      );
    }

    /**
     * REFUND PROCESSED (FINAL STATE)
     */
    if (event === "refund.processed") {
      const refund = payload.refund.entity;

      await Order.findOneAndUpdate(
        { razorpayPaymentId: refund.payment_id },
        { paymentStatus: "REFUNDED" }
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    return res.status(500).json({ success: false });
  }
};

module.exports = razorpayWebhook;
