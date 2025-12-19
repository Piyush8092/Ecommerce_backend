let Blog = require("../../models/blogModel");
const { deleteObject } = require("../../services/s3.service");

const updateBlog = async (req, res) => {
  try {
    let id = req.params.id;
    let payload = req.body;
    if (!payload) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existBlog = await Blog.findById(id);
    if (!existBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check authorization: must be ADMIN or the blog owner
    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== existBlog.userId.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    payload.userId = req.user._id;
    const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    });

    // Delete old image ONLY if a new one is provided
    if (payload.image && existBlog.image && payload.image !== existBlog.image) {
      try {
        await deleteObject(existBlog.image);
      } catch (err) {
        console.error("Failed to delete old blog image:", err);
      }
    }

    res.json({
      message: "Blog updated successfully",
      status: 200,
      data: updatedBlog,
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

module.exports = { updateBlog };
