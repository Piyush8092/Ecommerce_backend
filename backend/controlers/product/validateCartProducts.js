const Product = require("../../models/productModel");

const validateCartProducts = async (req, res) => {
  try {
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "No cart items provided",
        success: false,
        error: true,
      });
    }

    const productIds = items.map((i) => i.productId);

    // Fetch only purchasable products
    const validProducts = await Product.find({
      _id: { $in: productIds },
      isDeleted: false,
      stock: { $gt: 0 },
    }).select("_id");

    const validProductIdSet = new Set(
      validProducts.map((p) => p._id.toString())
    );

    const invalidProductIds = items
      .filter((item) => !validProductIdSet.has(item.productId.toString()));

    res.status(200).json({
      message: "Cart validation completed",
      data: {
        validProductIds: [...validProductIdSet],
        invalidProductIds,
      },
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("Cart validation error:", e);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = { validateCartProducts };
