const PolicyPage = require("../../models/PolicyPageSchema");

exports.createPolicyPage = async (req, res) => {
  try {
    const { slug } = req.body;

    const exists = await PolicyPage.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const page = await PolicyPage.create(req.body);

    res.status(201).json({ message: "Page created successfully", page });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
