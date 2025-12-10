let Category = require("../../models/CategoryModel");

const getAllCategory = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find().skip(skip).limit(parseInt(limit));
    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      message: "Categories retrieved successfully",
      status: 200,
      data: categories,
      total,
      totalPages,
      currentPage: parseInt(page),
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllCategory };

