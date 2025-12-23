const razorpayConfig = require("../../config/razorpay.config");

/**
 * Get Razorpay Key
 * Returns the Razorpay key ID for frontend integration
 */
const getRazorpayKey = async (req, res) => {
  try {
    res.json({
      message: "Razorpay key fetched successfully",
      status: 200,
      data: {
        keyId: razorpayConfig.keyId,
        isTestMode: razorpayConfig.isTestMode(),
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Razorpay Key Error:", error);
    res.status(500).json({
      message: "Failed to fetch Razorpay key",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getRazorpayKey };

