const Product = require("../../models/productModel");

const updateProductApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    // 1. Validate input
    if (!approvalStatus) {
      return res.status(400).json({
        message: "approvalStatus is required",
        success: false,
        error: true,
      });
    }

    const allowedStatus = ["PENDING", "APPROVED", "REJECTED"];

    if (!allowedStatus.includes(approvalStatus)) {
      return res.status(400).json({
        message: "Invalid approval status",
        success: false,
        error: true,
      });
    }

    // 2. Find product (not soft deleted)
    const product = await Product.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    // 3. Update approval status
    product.approvalStatus = approvalStatus;

    // audit field
    if (approvalStatus === "APPROVED") {
      product.approvedAt = new Date();
      product.approvedBy = req.user._id;
    }

    await product.save();

    return res.status(200).json({
      message: "Product approval status updated successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Update Approval Status Error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = { updateProductApprovalStatus };
