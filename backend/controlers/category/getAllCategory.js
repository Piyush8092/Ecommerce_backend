const Category = require("../../models/CategoryModel");

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({});

    res.json({
      message: "Categories retrieved successfully",
      status: 200,
      data: categories,
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
