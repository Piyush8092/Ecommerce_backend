const ProductReview = require("../../models/productReview");

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { _id: userId, role } = req.user;

    const review = await ProductReview.findOne({ _id: reviewId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Authorization
    if (role !== "ADMIN" && review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

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

module.exports = deleteReview;
