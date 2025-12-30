const ProductReview = require("../../models/productReview");

const toggleFeaturedReview = async (req, res) => {
  try {
    const id = req.params.id;

    const review = await ProductReview.findOne({
      _id: id,
      status: "ACTIVE",
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.isFeatured = !review.isFeatured;
    await review.save();

    res.status(200).json({
      success: true,
      data: {
        id: review._id,
        isFeatured: review.isFeatured,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = toggleFeaturedReview;
