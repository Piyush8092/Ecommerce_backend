const ProductReview = require("../../models/productReview");

const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const reviews = await ProductReview.find({})
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "name image")
      .populate({
        path: "productId",
        select: "name image",
        options: { slice: { image: 1 } },
      })
      .sort({ createdAt: -1 });

    const total = await ProductReview.countDocuments({});

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

module.exports = getAllReviews;
