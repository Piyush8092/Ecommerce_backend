const { generateUploadUrl } = require("../../services/s3.service");

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
];

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

    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType)) {
      return res
        .status(400)
        .json({
          message: "Invalid file type. Only images and videos are allowed.",
        });
    }

    const { uploadUrl, key } = await generateUploadUrl({
      folder: "reviews",
      entityId: userId,
      fileType,
    });

    res.status(200).json({
      success: true,
      uploadUrl,
      key,
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
