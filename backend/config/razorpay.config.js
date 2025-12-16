require("dotenv").config();

/**
 * Razorpay Configuration
 * Supports both TEST and LIVE modes based on environment variable
 */
const razorpayConfig = {
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  env: process.env.RAZORPAY_ENV || "test",
  
  // Check if running in test mode
  isTestMode: () => {
    return process.env.RAZORPAY_ENV === "test" || 
           process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_");
  },
  
  // Validate configuration
  validate: () => {
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
      throw new Error("Razorpay credentials are not configured properly");
    }
    
    if (razorpayConfig.isTestMode()) {
      console.log("⚠️  Razorpay running in TEST mode");
    } else {
      console.log("✅ Razorpay running in LIVE mode");
    }
    
    return true;
  },
  
  // Currency configuration
  currency: "INR",
  
  // Payment options
  options: {
    receipt_prefix: "order_rcptid_",
    payment_capture: 1, // Auto capture payment
  }
};

module.exports = razorpayConfig;

