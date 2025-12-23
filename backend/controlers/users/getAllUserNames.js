let userModel = require("../../models/userModel");

const getAllUserNames = async (req, res) => {
  try {
    const users = await userModel.find({}, "name _id");
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getAllUserNames };
