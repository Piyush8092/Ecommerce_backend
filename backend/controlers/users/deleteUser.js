let userModel = require("../../models/userModel");
const { deleteUserImage } = require("../../services/s3/userImage.service");

const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    let userId = req.user._id;

    let ExistUser = await userModel.findById(id);
    if (!ExistUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let UserRole = req.user.role;
    if (UserRole !== "ADMIN" && userId.toString() !== id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Delete user image from S3 if exists
    if (ExistUser.image) {
      try {
        await deleteUserImage(ExistUser.image);
      } catch (s3Error) {
        console.error("Error deleting user image from S3:", s3Error);
        // Continue with user deletion even if S3 deletion fails
      }
    }

    const result = await userModel.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
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

module.exports = { deleteUser };
