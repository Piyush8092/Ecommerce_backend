const Product = require("../../models/productModel");

const getProductNameAndImageByCatagory = async (req, res) => {
  try {
    const products = await Product.find(
      { categoryId: { $ne: null } },
      "categoryId image name"
    ).populate("categoryId");

    const uniqueMap = new Map();

    for (const item of products) {
      if (!item.categoryId) continue; // safety check

      const catId = item.categoryId._id.toString();

      // only insert if category not added before
      if (!uniqueMap.has(catId)) {
        uniqueMap.set(catId, {
          categoryId: catId,
          categoryName: item.categoryId.name,
          name: item.name,
          image: item.image?.[0] || null,
        });
      }
    }

    const uniqueProducts = Array.from(uniqueMap.values());

    res.json({
      message: "Unique category products fetched successfully",
      status: 200,
      data: uniqueProducts,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: err.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getProductNameAndImageByCatagory };
