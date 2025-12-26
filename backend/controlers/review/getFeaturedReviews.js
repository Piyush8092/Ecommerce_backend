const ProductReview = require("../../models/productReview");

const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({
      isFeatured: true,
      status: "ACTIVE",
    })
      .populate("userId", "name image")
      .sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = getFeaturedReviews;
