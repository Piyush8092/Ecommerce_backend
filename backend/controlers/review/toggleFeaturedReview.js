const ProductReview = require("../../models/productReview");

const toggleFeaturedReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    const review = await ProductReview.findOneAndUpdate(
      { _id: id, status: "ACTIVE" },
      { isFeatured },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${
        review.isFeatured ? "featured" : "unfeatured"
      } successfully`,
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
