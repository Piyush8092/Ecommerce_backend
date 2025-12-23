let Category = require("../../models/CategoryModel");
const { deleteObject } = require("../../services/s3.service");

const updateCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let payload = req.body;

    let existCategory = await Category.findById(id);
    if (!existCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if new name already exists (if name is being updated)
    if (payload.name && payload.name !== existCategory.name) {
      const duplicateCategory = await Category.findOne({ name: payload.name });
      if (duplicateCategory) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    // Delete old image ONLY if a new one is provided
    if (
      payload.image &&
      existCategory.image &&
      payload.image !== existCategory.image
    ) {
      try {
        await deleteObject(existCategory.image);
      } catch (err) {
        console.error("Failed to delete old category image:", err);
      }
    }

    res.json({
      message: "Category updated successfully",
      status: 200,
      data: updatedCategory,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { updateCategory };
