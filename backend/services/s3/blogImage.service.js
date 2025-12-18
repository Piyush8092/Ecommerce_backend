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
 * Generate pre-signed URL for blog image upload
 * @param {string} blogId - Blog ID
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<{uploadUrl: string, key: string}>}
 */
const generateBlogImageUploadUrl = async (blogId, fileType) => {
  if (!fileType || !fileType.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  const key = `blogs/${blogId}/cover`;

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
 * Delete blog image from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
const deleteBlogImage = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

module.exports = {
  s3Client,
  generateBlogImageUploadUrl,
  deleteBlogImage,
};
