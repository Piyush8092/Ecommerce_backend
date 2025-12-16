const razorpayService = require("../../services/razorpay.service");
const Order = require("../../models/orderModel");

/**
 * Verify Razorpay Payment
 * Verifies the payment signature and updates order status
 */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Missing payment verification details",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Verify payment signature
    const verificationResult = razorpayService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!verificationResult.success || !verificationResult.isValid) {
      return res.status(400).json({
        message: "Payment verification failed",
        status: 400,
        success: false,
        error: true,
      });
    }

    // If orderId is provided, update the order with payment details
    if (orderId) {
      const order = await Order.findById(orderId);
      
      if (order) {
        order.razorpayOrderId = razorpayOrderId;
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.paymentStatus = "PAID";
        order.paymentMethod = "PREPAID";
        
        await order.save();
      }
    }

    res.json({
      message: "Payment verified successfully",
      status: 200,
      data: {
        verified: true,
        razorpayOrderId,
        razorpayPaymentId,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);
    res.status(500).json({
      message: "Failed to verify payment",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { verifyRazorpayPayment };

