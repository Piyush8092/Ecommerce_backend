const userModel = require("../../models/userModel");

const getAllEmployeeNames = async (req, res) => {
  try {
    const employees = await userModel.find({ role: "EMPLOYEE" }, "name _id");

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getAllEmployeeNames };
