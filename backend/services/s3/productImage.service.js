const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Shared S3 client instance
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate pre-signed URL for product image upload
 * @param {string} productId - Product ID
 * @param {number} imageIndex - Image index (0, 1, 2, etc.)
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<{uploadUrl: string, key: string}>}
 */
const generateProductImageUploadUrl = async (
  productId,
  imageIndex,
  fileType
) => {
  if (!fileType || !fileType.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  // Validate file size is handled on frontend, but we set max size in pre-signed URL
  const key = `products/${productId}/image-${imageIndex}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 180, // 3 minutes
  });

  return { uploadUrl, key };
};

/**
 * Delete product image from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
const deleteProductImage = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

/**
 * Delete multiple product images from S3
 * @param {string[]} keys - Array of S3 object keys
 * @returns {Promise<void>}
 */
const deleteProductImages = async (keys) => {
  if (!keys || keys.length === 0) return;

  const deletePromises = keys.map((key) => deleteProductImage(key));
  await Promise.all(deletePromises);
};

module.exports = {
  s3Client,
  generateProductImageUploadUrl,
  deleteProductImage,
  deleteProductImages,
};
