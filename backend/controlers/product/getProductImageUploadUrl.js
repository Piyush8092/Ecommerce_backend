const {
  generateProductImageUploadUrl,
} = require("../../services/s3/productImage.service");

/**
 * Generate pre-signed URL for product image upload
 * Requires authentication
 * Body: { productId, imageIndex, fileType }
 */
const getProductImageUploadUrl = async (req, res) => {
  try {
    const { productId, imageIndex, fileType } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (imageIndex === undefined || imageIndex === null) {
      return res.status(400).json({ message: "Image index is required" });
    }

    if (!fileType || !fileType.startsWith("image/")) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only images are allowed." });
    }

    // Validate file size limit (5MB) - this is informational, actual validation happens on frontend
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const { uploadUrl, key } = await generateProductImageUploadUrl(
      productId,
      imageIndex,
      fileType
    );

    res.json({
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Error generating product image upload URL:", error);
    res.status(500).json({
      message: error.message || "Failed to generate upload URL",
    });
  }
};

module.exports = { getProductImageUploadUrl };
