const otpService = require("../../services/otp.service");
const User = require("../../models/userModel");

/**
 * Send OTP
 */
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (user && user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "User is blocked",
      });
    }

    // Validation
    const phoneRegex = /^[0-9]{10}$/;

    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    await otpService.createAndSendOtp(phone);

    res.status(200).json({
      success: true,
      nextStep: "OTP_VERIFICATION",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendOtp,
};
