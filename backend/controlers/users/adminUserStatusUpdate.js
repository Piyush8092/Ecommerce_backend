let userModel = require("../../models/userModel");

const adminUserStatusUpdate = async (req, res) => {
  try {
    let userId = req.params.userId;
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await userModel.findByIdAndUpdate(
      userId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      message: "User status updated successfully",
      status: 200,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { adminUserStatusUpdate };
