let Blog = require("../../models/blogModel");

const getAllBlog = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;
    let total = await Blog.countDocuments();
    let totalPages = Math.ceil(total / limit);

    const blog = await Blog.find()
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email");
    res.json({
      message: "Blog fetched successfully",
      status: 200,
      data: blog,
      success: true,
      error: false,
      total,
      totalPages,
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

module.exports = { getAllBlog };
