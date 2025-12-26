const ProductReview = require("../../models/productReview");

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      userId,
      status: "ACTIVE",
    };

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

module.exports = getUserReviews;
