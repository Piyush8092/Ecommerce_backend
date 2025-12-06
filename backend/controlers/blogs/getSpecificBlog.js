let Blog = require("../../models/blogModel");

const getSpecificBlog = async (req, res) => {
  try {
    let id = req.params.id;
    const blog = await Blog.findById(id).populate("userId", "name email");
    res.json({
      message: "Blog fetched successfully",
      status: 200,
      data: blog,
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

module.exports = { getSpecificBlog };
