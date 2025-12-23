let Category = require("../../models/CategoryModel");
const { deleteObject } = require("../../services/s3.service");

const deleteCategory = async (req, res) => {
  try {
    let id = req.params.id;

    let existCategory = await Category.findById(id);
    if (!existCategory) {
      return res.status(404).json({
        message: "Category not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Delete category image from S3 if exists
    if (existCategory.image) {
      try {
        await deleteObject(existCategory.image);
      } catch (s3Error) {
        console.error("Error deleting category image from S3:", s3Error);
        // Continue with category deletion even if S3 deletion fails
      }
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    res.json({
      message: "Category deleted successfully",
      status: 200,
      data: deletedCategory,
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

module.exports = { deleteCategory };
