const PolicyPage = require("../../models/PolicyPageSchema");

exports.getPolicyPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await PolicyPage.findOne({ slug }).lean(); // Using lean() to return plain JavaScript objects

    if (!page) return res.status(404).json({ message: "Page not found" });

    res.status(200).json(page);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
