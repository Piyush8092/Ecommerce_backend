let Product = require("../../models/productModel");
const { deleteObject } = require("../../services/s3.service");

const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch product to get image keys before deletion
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Delete all product images from S3 if they exist
    if (product.image && product.image.length > 0) {
      try {
        for (const image of product.image) {
          await deleteObject(image);
        }
      } catch (s3Error) {
        console.error("Error deleting product images from S3:", s3Error);
        // Continue with product deletion even if S3 deletion fails
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json({
      message: "Product deleted successfully",
      status: 200,
      data: deletedProduct,
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

module.exports = { deleteProduct };
