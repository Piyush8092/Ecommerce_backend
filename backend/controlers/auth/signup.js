const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const SignupRout = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Generate JWT
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      // Optionally attach token to response (not saving to DB again)
      const userResponse = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token,
      };
      return res.status(200).json({
        data: userResponse,
        message: "User already exists.",
        success: true,
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      role: "GENERAL",
    });

    newUser.loginDeviceName.push(req.headers["user-agent"]);
    // Save user to DB
    const savedUser = await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Optionally attach token to response (not saving to DB again)
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      token,
    };

    return res.status(200).json({
      message: "User registered successfully",
      success: true,
      data: userResponse,
      error: false,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      data: null,
      error: true,
    });
  }
};

module.exports = { SignupRout };
