const ProductReview = require("../../models/productReview");

const getMyProductReview = async (req, res) => {
  try {
    const { productId } = req.query;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const review = await ProductReview.findOne({
      productId,
      userId,
      status: "ACTIVE",
    })
      .populate("userId", "name image")

    res.status(200).json({
      success: true,
      hasReview: !!review,
      data: review || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = getMyProductReview;
