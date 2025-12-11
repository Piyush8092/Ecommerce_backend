let Blog = require("../../models/blogModel");

const createBlog = async (req, res) => {
  try {
    let userId = req.user._id;
    let payload = req.body;

    if (
      !payload.heading ||
      !payload.image ||
      !payload.categoryId ||
      !payload.contentHTML ||
      !payload.contentJSON
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Add userId to payload BEFORE creating blog
    payload.userId = userId;

    // Create new blog with userId
    const newBlog = new Blog(payload);
    const savedBlog = await newBlog.save();

    res.json({
      message: "Blog created successfully",
      status: 200,
      data: savedBlog,
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("Create blog error:", e);
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createBlog };
