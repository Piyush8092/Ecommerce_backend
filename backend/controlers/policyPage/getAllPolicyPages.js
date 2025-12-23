const PolicyPage = require("../../models/PolicyPageSchema");

exports.getAllPolicyPages = async (req, res) => {
  try {
    const pages = await PolicyPage.find().sort({ createdAt: -1 }).lean(); // Sorting by createdAt in descending order
    res.status(200).json(pages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
