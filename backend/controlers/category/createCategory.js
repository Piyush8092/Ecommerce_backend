let Category = require("../../models/CategoryModel");

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and Image fields are required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();

    res.json({
      message: "Category created successfully",
      status: 200,
      data: savedCategory,
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

module.exports = { createCategory };
