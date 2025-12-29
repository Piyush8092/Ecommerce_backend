const ProductReview = require("../../models/productReview");
const { deleteObject } = require("../../services/s3.service");
const updateProductRating = require("../../services/updateProductRating.service");

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { _id: userId } = req.user;

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

    // Authorization: Only the user who created the review can delete it
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete all review images from S3 if they exist
    if (review.media.images && review.media.images.length > 0) {
      try {
        for (const image of review.media.images) {
          await deleteObject(image);
        }
      } catch (s3Error) {
        console.error("Error deleting review images from S3:", s3Error);
        // Continue with review deletion even if S3 deletion fails
      }
    }
    // Delete review video from S3 if it exists
    if (review.media.video) {
      try {
        await deleteObject(review.media.video);
      } catch (s3Error) {
        console.error("Error deleting review video from S3:", s3Error);
        // Continue with review deletion even if S3 deletion fails
      }
    }

    await ProductReview.findByIdAndDelete(reviewId);

    await updateProductRating(review.productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = deleteReview;
