const { generateUploadUrl } = require("../../services/s3.service");

/**
 * Generate pre-signed URL for user image upload
 * Requires authentication
 * Body: { fileType }
 */
const getUserProfileImageUploadUrl = async (req, res) => {
  try {
    const { fileType } = req.body;
    const userId = req.user.id;

    const { uploadUrl, key } = await generateUploadUrl({
      folder: "users",
      entityId: userId,
      fileType,
    });

    res.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating user image upload URL:", error);
    res.status(500).json({
      message: error.message || "Failed to generate upload URL",
    });
  }
};

module.exports = { getUserProfileImageUploadUrl };
