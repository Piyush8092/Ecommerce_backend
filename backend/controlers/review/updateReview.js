const ProductReview = require("../../models/productReview");
const { deleteObject } = require("../../services/s3.service");
const updateProductRating = require("../../services/updateProductRating.service");

const updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await ProductReview.findOne({
      _id: reviewId,
      status: "ACTIVE",
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Authorization: Only the user who created the review can update it
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Capture old media BEFORE update
    const oldImages = review.media?.images || [];
    const oldVideo = review.media?.video || null;

    const allowedUpdates = ["rating", "message", "media"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        review[field] = req.body[field];
      }
    });

    await review.save();

    await updateProductRating(review.productId);

    // Now compute diff safely
    const newImages = review.media?.images || [];
    const newVideo = review.media?.video || null;

    const removedImages = oldImages.filter((img) => !newImages.includes(img));

    // Delete removed images from S3
    for (const imageKey of removedImages) {
      try {
        await deleteObject(imageKey);
      } catch (err) {
        console.error("Failed to delete image:", imageKey, err);
      }
    }

    if (oldVideo && oldVideo !== newVideo) {
      try {
        await deleteObject(oldVideo);
      } catch (err) {
        console.error("Failed to delete old video:", oldVideo, err);
      }
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = updateReview;
