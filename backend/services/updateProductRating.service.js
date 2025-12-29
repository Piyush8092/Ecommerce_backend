const mongoose = require("mongoose"); // Import mongoose library
const ProductReview = require("../models/productReview");
const Product = require("../models/productModel");

async function updateProductRating(productId) {
  const stats = await ProductReview.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "ACTIVE",
        rating: { $gte: 1 },
      },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (!stats.length) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: 0,
      totalReviews: 0,
    });
    return;
  }

  await Product.findByIdAndUpdate(productId, {
    avgRating: Number(stats[0].avgRating.toFixed(1)),
    totalReviews: stats[0].totalReviews,
  });
}

module.exports = updateProductRating;
