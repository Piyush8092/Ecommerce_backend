const ProductReview = require("../../models/productReview");

const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      productId,
      status: "ACTIVE",
    };

    // Exclude logged-in user's review (if exists)
    if (req.user && req.user._id) {
      filter.userId = { $ne: req.user._id };
    }

    const reviews = await ProductReview.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name image")
      .populate("productId", "name image")
      .sort({ createdAt: -1 });

    const total = await ProductReview.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reviews,
      total,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = getProductReviews;
