const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const completeProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Bearer token missing",
      });
    }

    const tempToken = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (decoded.stage !== "OTP_VERIFIED") {
      return res.status(403).json({
        success: false,
        message: "Invalid token stage",
      });
    }

    const { name, email } = req.body;
    const tokenPhone = decoded.phone;
    const normalizedEmail = email.trim().toLowerCase();

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Valid name required",
      });
    }

    if (!normalizedEmail || normalizedEmail.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Valid email required",
      });
    }

    // 🔐 Check if phone already exists
    const existingUser = await User.findOne({ phone: tokenPhone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔐 Check if email already exists
    const emailExists = await User.findOne({ normalizedEmail });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await User.create({
      phone: tokenPhone, // 🔒 ALWAYS from token
      name: name.trim(),
      email: normalizedEmail,
    });

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set cookie
    res.cookie("jwt", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      success: true,
      data: user,
      token: authToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { completeProfile };
