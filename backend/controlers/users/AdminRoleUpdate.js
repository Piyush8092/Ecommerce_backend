let userModel = require("../../models/userModel");
const { deleteObject } = require("../../services/s3.service");

const AdminRoleUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    let payload = req.body;
    let ExistUser = await userModel.findById(id);
    if (!ExistUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let UserRole = req.user.role;
    if (UserRole !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const result = await userModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    // Delete old user image ONLY if a new one is provided
    if (payload.image && ExistUser.image && payload.image !== ExistUser.image) {
      try {
        await deleteObject(ExistUser.image);
      } catch (err) {
        console.error("Failed to delete old user image:", err);
      }
    }

    res.json({
      message: "User updated successfully",
      status: 200,
      data: result,
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

module.exports = { AdminRoleUpdate };
