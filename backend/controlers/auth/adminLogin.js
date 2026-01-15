const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const adminLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email, name });
    if (existingUser && existingUser.role !== "GENERAL") {
      if (existingUser.status === "BLOCKED")
        return res.status(403).json({ message: "User is blocked" });

      // Generate JWT
      const token = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser.role,
          email: existingUser.email,
          name: existingUser.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      // Optionally attach token to response (not saving to DB again)
      const userResponse = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        image: existingUser.image,
        token,
      };
      return res.status(200).json({
        data: userResponse,
        message: "login successfully",
        success: true,
      });
    }

    return res.status(401).json({
      message: "Invalid credentials",
      success: false,
      data: null,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
      error: true,
    });
  }
};

module.exports = { adminLogin };
