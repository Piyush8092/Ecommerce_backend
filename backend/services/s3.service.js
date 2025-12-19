const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const s3Client = require("../config/s3Client.config");

const generateUploadUrl = async ({ folder, entityId, fileType }) => {
  if (!fileType || !fileType.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  const extension = fileType.split("/")[1];
  const key = `${folder}/${entityId}/${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 180,
  });

  return { uploadUrl, key };
};

const deleteObject = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

module.exports = {
  generateUploadUrl,
  deleteObject,
};
