let blogModel = require("../../models/blogModel");

const getTotalBlogCount = async (req, res) => {
  try {
    let totalBlogCount = await blogModel.countDocuments();
    res.status(200).json({
      message: "Total blog count retrieved successfully",
      data: totalBlogCount,
      success: true,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { getTotalBlogCount };
