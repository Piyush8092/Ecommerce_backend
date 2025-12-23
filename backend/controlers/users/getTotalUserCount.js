let userModel = require("../../models/userModel");

const getTotalUserCount = async (req, res) => {
  try {
    let totalUserCount = await userModel.countDocuments();
    res.status(200).json({
      message: "Total user count retrieved successfully",
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

module.exports = { getTotalUserCount };
