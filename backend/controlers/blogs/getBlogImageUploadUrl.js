const {
  generateBlogImageUploadUrl,
} = require("../../services/s3/blogImage.service");

/**
 * Generate pre-signed URL for blog image upload
 * Requires authentication
 * Body: { blogId, fileType }
 */
const getBlogImageUploadUrl = async (req, res) => {
  try {
    const { blogId, fileType } = req.body;

    // Validate required fields
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    if (!fileType || !fileType.startsWith("image/")) {
      return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
    }

    // Validate file size limit (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const { uploadUrl, key } = await generateBlogImageUploadUrl(
      blogId,
      fileType
    );

    res.json({
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Error generating blog image upload URL:", error);
    res.status(500).json({ 
      message: error.message || "Failed to generate upload URL" 
    });
  }
};

module.exports = { getBlogImageUploadUrl };

