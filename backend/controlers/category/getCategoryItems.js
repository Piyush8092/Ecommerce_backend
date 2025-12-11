const Blog = require("../../models/blogModel");
const Product = require("../../models/productModel");
const Carousel = require("../../models/CarsoleModel");

const getCategoryItems = async (req, res) => {
  try {
    const { categoryId, type, page = 1, limit = 10 } = req.query;

    // Validate required params
    if (!categoryId || !type) {
      return res.status(400).json({
        message: "Missing required parameters: categoryId or type",
      });
    }

    // Map `type` to corresponding Mongoose model
    const modelMap = {
      blog: Blog,
      product: Product,
      carousel: Carousel,
    };

    const Model = modelMap[type];

    if (!Model) {
      return res.status(400).json({
        message: "Invalid type parameter",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch total count for pagination UI
    const totalItems = await Model.countDocuments({ categoryId });

    // Fetch paginated documents
    const data = await Model.find({ categoryId })
      .populate("categoryId", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // optional: newest first

    return res.status(200).json({
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data,
    });
  } catch (error) {
    console.error("Error fetching category items:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { getCategoryItems };
