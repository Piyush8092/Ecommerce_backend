const razorpayService = require("../../services/razorpay.service");

/**
 * Create Razorpay Order
 * Creates a Razorpay order for payment processing
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid amount is required",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Create Razorpay order
    const result = await razorpayService.createOrder({
      amount,
      currency: currency || "INR",
      receipt: receipt || `order_${Date.now()}`,
    });

    if (!result.success) {
      return res.status(500).json({
        message: result.error,
        status: 500,
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Razorpay order created successfully",
      status: 200,
      data: result.data,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    res.status(500).json({
      message: "Failed to create Razorpay order",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createRazorpayOrder };

