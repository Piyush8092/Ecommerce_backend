const ProductReview = require("../../models/productReview");

const adminDeleteReview = async (req, res) => {
  try {
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

    // Soft delete the review by setting status to DELETED
    review.status = "DELETED";
    await review.save();

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

module.exports = adminDeleteReview;
