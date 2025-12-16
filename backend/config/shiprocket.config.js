require("dotenv").config();

/**
 * Shiprocket Configuration
 * Supports both SANDBOX and PRODUCTION modes based on environment variable
 */
const shiprocketConfig = {
  email: process.env.SHIPROCKET_EMAIL,
  password: process.env.SHIPROCKET_PASSWORD,
  env: process.env.SHIPROCKET_ENV || "sandbox",
  apiUrl: process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external",
  
  // Check if running in sandbox mode
  isSandboxMode: () => {
    return process.env.SHIPROCKET_ENV === "sandbox";
  },
  
  // Validate configuration
  validate: () => {
    if (!shiprocketConfig.email || !shiprocketConfig.password) {
      throw new Error("Shiprocket credentials are not configured properly");
    }
    
    if (shiprocketConfig.isSandboxMode()) {
      console.log("⚠️  Shiprocket running in SANDBOX mode");
    } else {
      console.log("✅ Shiprocket running in PRODUCTION mode");
    }
    
    return true;
  },
  
  // Token cache configuration
  tokenCache: {
    token: null,
    expiresAt: null,
  },
  
  // Default pickup location (to be configured per business)
  defaultPickupLocation: "Primary",
  
  // Shipment options
  options: {
    length: 10, // cm
    breadth: 10, // cm
    height: 10, // cm
    weight: 0.5, // kg
  },
  
  // Webhook configuration
  webhook: {
    secret: process.env.SHIPROCKET_WEBHOOK_SECRET || "shiprocket_webhook_secret",
  }
};

module.exports = shiprocketConfig;

