let Category = require("../../models/CategoryModel");

const getSpecificCategory = async (req, res) => {
  try {
    let id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        status: 404,
        data: {},
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Category retrieved successfully",
      status: 200,
      data: category,
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

module.exports = { getSpecificCategory };

