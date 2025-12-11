const Blog = require("../../models/blogModel");

const getQueryBlog = async (req, res) => {
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let queryObj = {};
    if (query) {
      queryObj.$or = [
        { heading: { $regex: query, $options: "i" } },
        { contentHTML: { $regex: query, $options: "i" } },
      ];
    }

    const [total, blogs] = await Promise.all([
      Blog.countDocuments(queryObj),
      Blog.find(queryObj)
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email")
        .populate("categoryId"),
    ]);

    res.status(200).json({
      message: "Blogs fetched successfully",
      success: true,
      error: false,
      data: blogs,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
      data: e,
    });
  }
};

module.exports = { getQueryBlog };
