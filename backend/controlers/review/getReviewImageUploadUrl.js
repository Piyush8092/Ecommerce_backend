const { generateUploadUrl } = require("../../services/s3.service");

/**
 * Generate pre-signed URL for review image upload
 * Requires authentication
 * Body: { userId, fileType }
 */
const getReviewImageUploadUrl = async (req, res) => {
  try {
    const { userId, fileType } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!fileType || !fileType.startsWith("image/")) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only images are allowed." });
    }

    // Validate file size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const { uploadUrl, key } = await generateUploadUrl({
      folder: "reviews",
      entityId: userId,
      fileType,
    });

    res.status(200).json({
      success: true,
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Error generating review image upload URL:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate upload URL",
    });
  }
};

module.exports = getReviewImageUploadUrl;
