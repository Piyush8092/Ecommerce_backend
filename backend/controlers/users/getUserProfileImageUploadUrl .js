const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getUserProfileImageUploadUrl = async (req, res) => {
  try {
    const { fileType } = req.body;
    const userId = req.user.id;

    if (!fileType || !fileType.startsWith("image/")) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const key = `users/${userId}/avatar`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 180,
    });

    res.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

module.exports = { getUserProfileImageUploadUrl };
