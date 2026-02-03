const Category = require("../../models/CategoryModel");

const queryCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.query || "";

    const skip = (page - 1) * limit;

    // Build regex for search (case-insensitive)
    const searchRegex = new RegExp(search, "i");

    // Total count for pagination (after search)
    const totalCategories = await Category.countDocuments({
      name: searchRegex,
    });

    const result = await Category.aggregate([
      // SEARCH MATCH
      { $match: { name: searchRegex } },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // BLOG COUNT
      {
        $lookup: {
          from: "blogs",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$categoryId", "$$categoryId"] },
              },
            },
            { $count: "totalBlogs" },
          ],
          as: "blogStats",
        },
      },
      {
        $addFields: {
          totalBlogs: {
            $ifNull: [{ $arrayElemAt: ["$blogStats.totalBlogs", 0] }, 0],
          },
        },
      },
      { $project: { blogStats: 0 } },

      // PRODUCT COUNT
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                isDeleted: false,
                $expr: { $eq: ["$categoryId", "$$categoryId"] },
              },
            },
            { $count: "totalProducts" },
          ],
          as: "productStats",
        },
      },
      {
        $addFields: {
          totalProducts: {
            $ifNull: [{ $arrayElemAt: ["$productStats.totalProducts", 0] }, 0],
          },
        },
      },
      { $project: { productStats: 0 } },

      // CAROUSEL COUNT
      {
        $lookup: {
          from: "carsoles",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$categoryId", "$$categoryId"] },
              },
            },
            { $count: "totalCarousels" },
          ],
          as: "carouselStats",
        },
      },
      {
        $addFields: {
          totalCarousels: {
            $ifNull: [
              { $arrayElemAt: ["$carouselStats.totalCarousels", 0] },
              0,
            ],
          },
        },
      },
      { $project: { carouselStats: 0 } },
    ]);

    return res.json({
      total: totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
      data: result,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

module.exports = { queryCategory };
