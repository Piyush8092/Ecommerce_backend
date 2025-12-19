const { generateUploadUrl } = require("../../services/s3.service");

/**
 * Generate pre-signed URL for carousel image upload
 * Requires authentication
 * Body: { carouselId, fileType }
 */
const getCarouselImageUploadUrl = async (req, res) => {
  try {
    const { carouselId, fileType } = req.body;

    // Validate required fields
    if (!carouselId) {
      return res.status(400).json({ message: "Carousel ID is required" });
    }

    if (!fileType || !fileType.startsWith("image/")) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only images are allowed." });
    }

    // Validate file size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const { uploadUrl, key } = await generateUploadUrl({
      folder: "carousel",
      entityId: carouselId,
      fileType,
    });

    res.json({
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Error generating carousel image upload URL:", error);
    res.status(500).json({
      message: error.message || "Failed to generate upload URL",
    });
  }
};

module.exports = { getCarouselImageUploadUrl };
