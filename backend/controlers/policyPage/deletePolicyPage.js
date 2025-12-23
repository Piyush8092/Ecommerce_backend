const PolicyPage = require("../../models/PolicyPageSchema");

exports.deletePolicyPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await PolicyPage.findOneAndDelete({ slug });

    if (!deleted) return res.status(404).json({ message: "Page not found" });

    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
