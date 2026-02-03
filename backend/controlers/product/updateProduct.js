let Product = require("../../models/productModel");
const { deleteObject } = require("../../services/s3.service");

const updateProduct = async (req, res) => {
  try {
    const payload = req.body;
    let id = req.params.id;

    if (!payload && Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const existProduct = await Product.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      payload,
      { new: true }
    );

    const oldImages = existProduct.image || [];
    const newImages = payload.image || [];

    const removedImages = oldImages.filter((img) => !newImages.includes(img));

    // Delete removed images from S3
    for (const imageKey of removedImages) {
      try {
        await deleteObject(imageKey);
      } catch (err) {
        console.error("Failed to delete image:", imageKey, err);
      }
    }

    res.json({
      message: "Product updated successfully",
      status: 200,
      data: updatedProduct,
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

module.exports = { updateProduct };
