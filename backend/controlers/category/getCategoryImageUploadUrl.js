const {
  generateCategoryImageUploadUrl,
} = require("../../services/s3/categoryImage.service");

/**
 * Generate pre-signed URL for category image upload
 * Requires authentication and ADMIN role
 * Body: { categoryId, fileType }
 */
const getCategoryImageUploadUrl = async (req, res) => {
  try {
    const { categoryId, fileType } = req.body;

    // Validate required fields
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    if (!fileType || !fileType.startsWith("image/")) {
      return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
    }

    // Validate file size limit (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const { uploadUrl, key } = await generateCategoryImageUploadUrl(
      categoryId,
      fileType
    );

    res.json({
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Error generating category image upload URL:", error);
    res.status(500).json({ 
      message: error.message || "Failed to generate upload URL" 
    });
  }
};

module.exports = { getCategoryImageUploadUrl };

