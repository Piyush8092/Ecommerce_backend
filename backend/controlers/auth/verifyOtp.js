const otpService = require("../../services/otp.service");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

/**
 * Verify OTP
 */
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    const otpRegex = /^[0-9]{6}$/;

    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    if (!otp || !otpRegex.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await otpService.verifyOtp(phone, otp);

    const user = await User.findOne({ phone });

    // temp token after OTP verification
    const tempToken = jwt.sign(
      { phone, stage: "OTP_VERIFIED" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // existing user → login
    if (user) {
      const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      res.cookie("jwt", authToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authToken,
      };

      return res.status(200).json({
        success: true,
        nextStep: "AUTHENTICATED",
        token: authToken,
        data: userResponse,
      });
    }

    // new user → profile required
    res.status(200).json({
      success: true,
      nextStep: "PROFILE_REQUIRED",
      tempToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  verifyOtp,
};
