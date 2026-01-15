const User = require("../models/userModel");

const checkUserBlocked = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("status");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Action not allowed.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUserBlocked;
