const ProductReview = require("../../models/productReview");

const adminUpdateReviewStatus = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { status } = req.body;

    const review = await ProductReview.findOne({
      _id: reviewId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update the review status to the provided value
    review.status = status.toUpperCase();
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = adminUpdateReviewStatus;
