let userModel = require("../../models/userModel");

// get last 7 days user count
const getNewUsersCount = async (req, res) => {
  try {
    let totalUserCount = await userModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    res.status(200).json({
      message: "New users count retrieved successfully in last 7 days",
      data: totalUserCount,
      success: true,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { getNewUsersCount };
